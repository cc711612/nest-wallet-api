import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { WalletUser } from '../entities/wallet-user.entity';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { last } from 'rxjs';
import { paginate } from '../utils/pagination.util';

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
    const [wallets, total] = await this.walletRepository.createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('wallet.id IN (:...walletIds)', { walletIds })
      .orWhere('wallet.userId = :userId', { userId })
      .andWhere(query.status ? 'wallet.status = :status' : '1=1', { status: query.status })
      .select(['wallet.id', 'wallet.userId', 'wallet.title', 'wallet.code', 'wallet.unit', 'wallet.properties', 'wallet.status', 'wallet.updatedAt', 'wallet.createdAt', 'user.id', 'user.name'])
      .orderBy('wallet.updatedAt', 'DESC')
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .getManyAndCount();
    
    const pagination = paginate(total, perPage, currentPage);

    return {
      pagination,
      wallets,
    };
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
}