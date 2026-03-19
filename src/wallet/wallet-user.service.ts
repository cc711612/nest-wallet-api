import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletUser } from './entities/wallet-user.entity';
import { CreateWalletUserDto } from './dto/create-wallet-user.dto';
import { UpdateWalletUserDto } from './dto/update-wallet-user.dto';

@Injectable()
export class WalletUserService {
  constructor(
    @InjectRepository(WalletUser)
    private walletUserRepository: Repository<WalletUser>,
  ) {}

  async create(createWalletUserDto: CreateWalletUserDto): Promise<WalletUser> {
    const walletUser = this.walletUserRepository.create(createWalletUserDto);
    return await this.walletUserRepository.save(walletUser);
  }

  async findAll(): Promise<WalletUser[]> {
    return await this.walletUserRepository.find({
      relations: ['user', 'wallet'],
    });
  }

  async findOne(id: number): Promise<WalletUser> {
    const walletUser = await this.walletUserRepository.findOne({
      where: { id },
      relations: ['user', 'wallet', 'devices', 'splits', 'walletDetails'],
    });

    if (!walletUser) {
      throw new NotFoundException(`WalletUser with ID ${id} not found`);
    }

    return walletUser;
  }

  async findByWalletAndUser(walletId: number, userId: number): Promise<WalletUser | undefined> {
    const walletUser = await this.walletUserRepository.findOne({
      where: { walletId, userId },
      relations: ['user', 'wallet'],
    });

    return walletUser || undefined;
  }

  async update(id: number, updateWalletUserDto: UpdateWalletUserDto): Promise<WalletUser> {
    const walletUser = await this.findOne(id);
    Object.assign(walletUser, updateWalletUserDto);
    return await this.walletUserRepository.save(walletUser);
  }

  async updateCompat(
    id: number,
    payload: {
      name?: string;
      notifyEnable?: boolean;
    },
  ): Promise<WalletUser> {
    const updateData: Partial<WalletUser> = {};
    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }
    if (payload.notifyEnable !== undefined) {
      updateData.notifyEnable = payload.notifyEnable;
    }

    await this.walletUserRepository.update(id, updateData);

    const updated = await this.walletUserRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`WalletUser with ID ${id} not found`);
    }

    return updated;
  }

  async softDelete(id: number): Promise<void> {
    const walletUser = await this.findOne(id);
    walletUser.deletedAt = new Date();
    await this.walletUserRepository.save(walletUser);
  }

  async softDeleteCompat(id: number): Promise<void> {
    const result = await this.walletUserRepository.update(id, { deletedAt: new Date() });
    if (!result.affected) {
      throw new NotFoundException(`WalletUser with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<WalletUser> {
    const walletUser = await this.findOne(id);
    walletUser.deletedAt = undefined;
    return await this.walletUserRepository.save(walletUser);
  }

  async getWalletUsers(userId?: number, walletUserId?: number): Promise<any[]> {
    const query = this.walletUserRepository.createQueryBuilder('walletUser')
      .leftJoin('walletUser.wallet', 'wallet')
      .select([
        'walletUser.id AS wallet_user_id',
        'walletUser.name AS wallet_user_name',
        'walletUser.walletId AS wallet_id',
        'walletUser.notifyEnable AS notify_enable',
        'wallet.id AS relation_wallet_id',
        'wallet.code AS relation_wallet_code',
      ]);

    if (userId) {
      query.andWhere('walletUser.userId = :userId', { userId });
    }

    if (walletUserId) {
      query.andWhere('walletUser.id = :walletUserId', { walletUserId });
    }

    const walletUsers = await query.getRawMany<{
      wallet_user_id: number | string;
      wallet_user_name: string;
      wallet_id: number | string;
      notify_enable: boolean | number;
      relation_wallet_id: number | string | null;
      relation_wallet_code: string | null;
    }>();

    return walletUsers.map((walletUser) => ({
      id: Number(walletUser.wallet_user_id),
      name: walletUser.wallet_user_name,
      walletId: Number(walletUser.wallet_id),
      notifyEnable: Boolean(walletUser.notify_enable),
      wallets: {
        id: Number(walletUser.relation_wallet_id ?? walletUser.wallet_id),
        code: walletUser.relation_wallet_code,
      },
    }));
  }
}
