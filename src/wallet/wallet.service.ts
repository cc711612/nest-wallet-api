import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletUser } from './entities/wallet-user.entity';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { paginate } from '../utils/pagination.util';
import { Brackets } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletUser)
    private readonly walletUserRepository: Repository<WalletUser>,
  ) {}

  create(walletData: Partial<Wallet>) {
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

  async findAll(query: FindAllWalletsDto, userId: number) {
    const currentPage = parseInt(query.page as any, 10) || 1;
    const perPage = parseInt(query.perPage as any, 10) || 10;
    const walletUsers = await this.walletUserRepository.find({
      where: { userId, isAdmin: false },
      select: ['walletId'],
    });
    const walletIds = walletUsers.map(walletUser => walletUser.walletId);
    const queryBuilder = this.walletRepository.createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where(new Brackets((qb) => {
        qb.where('wallet.id IN (:...walletIds)', { walletIds })
          .orWhere('wallet.userId = :userId', { userId });
      }));
      // Add search filter
      if (query.status != undefined) {
        queryBuilder.andWhere('wallet.status = :status', { status: query.status });
      }
      queryBuilder.select(['wallet.id', 'wallet.userId', 'wallet.title', 'wallet.code', 'wallet.unit', 'wallet.properties', 'wallet.status', 'wallet.updatedAt', 'wallet.createdAt', 'user.id', 'user.name'])
      .orderBy('wallet.updatedAt', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage);

    const [wallets, total] = await queryBuilder.getManyAndCount();
    
    // Format dates in Y-m-d H:i:s format
    const formattedWallets = wallets.map(wallet => {
      return {
        ...wallet,
        createdAt: this.formatDate(wallet.createdAt),
        updatedAt: this.formatDate(wallet.updatedAt)
      };
    });

    const pagination = paginate(total, perPage, currentPage);
    return {
      pagination,
      wallets: formattedWallets,
    };
  }

  // Helper method to format date to Y-m-d H:i:s
  private formatDate(date: Date): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  findOne(id: number, userId: number) {
    return this.walletRepository.findOne({ where: { id , userId} });
  }

  update(id: number, updateData: Partial<Wallet>) {
    return this.walletRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.walletRepository.delete(id);
  }

  async findUsersByWalletCode(code: string) {
    const wallet = await this.walletRepository.findOne({ where: { code } });
    if (!wallet) {
      throw new NotFoundException(`Wallet with code ${code} not found`);
    }

    const walletUsers = await this.walletUserRepository.find({
      where: { walletId: wallet.id },
    });

    return {
      wallet: {
        users: walletUsers.map(walletUser => ({
          id: walletUser.id,
          name: walletUser.name,
          userId: walletUser.userId,
          isAdmin: walletUser.isAdmin,
          notifyEnable: walletUser.notifyEnable,
        })),
      },
    };
  }
}