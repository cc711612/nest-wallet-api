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

  async softDelete(id: number): Promise<void> {
    const walletUser = await this.findOne(id);
    walletUser.deletedAt = new Date();
    await this.walletUserRepository.save(walletUser);
  }

  async restore(id: number): Promise<WalletUser> {
    const walletUser = await this.findOne(id);
    walletUser.deletedAt = undefined;
    return await this.walletUserRepository.save(walletUser);
  }

  async getWalletUsers(userId?: number, walletUserId?: number): Promise<any[]> {
    const query = this.walletUserRepository.createQueryBuilder('walletUser')
      .leftJoinAndSelect('walletUser.wallet', 'wallet')
      .select(['walletUser.id', 'walletUser.name', 'walletUser.walletId', 'walletUser.notifyEnable', 'wallet.id', 'wallet.code']);

    if (userId) {
      query.andWhere('walletUser.userId = :userId', { userId });
    }

    if (walletUserId) {
      query.andWhere('walletUser.id = :walletUserId', { walletUserId });
    }

    const walletUsers = await query.getMany();

    return walletUsers.map(walletUser => ({
      id: walletUser.id,
      name: walletUser.name,
      walletId: walletUser.walletId,
      notifyEnable: walletUser.notifyEnable,
      wallets: walletUser.wallet,
    }));
  }
}