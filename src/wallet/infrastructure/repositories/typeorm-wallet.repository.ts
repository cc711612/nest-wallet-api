import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { FindAllWalletsDto } from '../../dto/find-all-wallets.dto';
import { Wallet } from '../../entities/wallet.entity';
import { WalletUser } from '../../entities/wallet-user.entity';
import { WalletListResult, WalletSummary, WalletUsersView } from '../../domain/entities/wallet.aggregate';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { paginate } from '../../../utils/pagination.util';

@Injectable()
export class TypeormWalletRepository implements WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletUser)
    private readonly walletUserRepository: Repository<WalletUser>,
  ) {}

  async create(walletData: Partial<Wallet>): Promise<Wallet> {
    const { properties = {}, ...rest } = walletData;
    const { unitConfigurable = false, decimalPlaces = 0 } = properties;
    const newWallet = this.walletRepository.create({
      ...rest,
      properties: {
        unitConfigurable,
        decimalPlaces,
      },
    });

    return this.walletRepository.save(newWallet);
  }

  async findAll(query: FindAllWalletsDto, userId: number): Promise<WalletListResult> {
    const currentPage = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const walletUsers = await this.walletUserRepository.find({
      where: { userId, isAdmin: false },
      select: ['walletId'],
    });
    const walletIds = walletUsers.map((walletUser) => walletUser.walletId);

    const queryBuilder = this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where(
        new Brackets((qb) => {
          // 中文備註：可見錢包 = 我是擁有者 或 我是非 admin 成員。
          if (walletIds.length > 0) {
            qb.where('wallet.id IN (:...walletIds)', { walletIds });
            qb.orWhere('wallet.userId = :userId', { userId });
            return;
          }
          qb.where('wallet.userId = :userId', { userId });
        }),
      );

    if (query.status !== undefined) {
      queryBuilder.andWhere('wallet.status = :status', { status: query.status });
    }

    queryBuilder
      .select([
        'wallet.id',
        'wallet.userId',
        'wallet.title',
        'wallet.code',
        'wallet.unit',
        'wallet.mode',
        'wallet.properties',
        'wallet.status',
        'wallet.updatedAt',
        'wallet.createdAt',
        'user.id',
        'user.name',
      ])
      .orderBy('wallet.updatedAt', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage);

    const [wallets, total] = await queryBuilder.getManyAndCount();
    const formattedWallets: WalletSummary[] = wallets.map((wallet) => ({
      id: wallet.id,
      userId: wallet.userId,
      users: wallet.user
        ? {
            id: wallet.user.id,
            name: wallet.user.name,
          }
        : null,
      title: wallet.title,
      code: wallet.code,
      unit: wallet.unit,
      mode: wallet.mode ?? 'multi',
      status: wallet.status,
      properties: {
        unitConfigurable: Boolean(wallet.properties?.unitConfigurable),
        decimalPlaces: Number(wallet.properties?.decimalPlaces ?? 0),
      },
      createdAt: this.formatDate(wallet.createdAt),
      updatedAt: this.formatDate(wallet.updatedAt),
    }));

    return {
      pagination: paginate(total, perPage, currentPage),
      wallets: formattedWallets,
    };
  }

  findOne(id: number, userId: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { id, userId } });
  }

  async update(id: number, updateData: Partial<Wallet>): Promise<void> {
    await this.walletRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    await this.walletRepository.delete(id);
  }

  async findUsersByWalletCode(code: string): Promise<WalletUsersView> {
    const wallet = await this.walletRepository.findOne({ where: { code } });
    if (!wallet) {
      throw new NotFoundException(`Wallet with code ${code} not found`);
    }

    const walletUsers = await this.walletUserRepository.find({
      where: { walletId: wallet.id },
    });

    return {
      wallet: {
        users: walletUsers.map((walletUser) => ({
          id: walletUser.id,
          name: walletUser.name,
          userId: walletUser.userId,
          isAdmin: walletUser.isAdmin,
          notifyEnable: walletUser.notifyEnable,
        })),
      },
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
