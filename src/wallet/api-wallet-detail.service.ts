import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletDetails } from './entities/wallet-details.entity';
import { WalletUser } from './entities/wallet-user.entity';

@Injectable()
export class ApiWalletDetailService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletDetails)
    private readonly walletDetailsRepository: Repository<WalletDetails>,
    @InjectRepository(WalletUser)
    private readonly walletUserRepository: Repository<WalletUser>,
  ) {}

  async index(walletId: number, _userId: number) {
    const wallet = await this.walletRepository.findOne({ where: { id: walletId, deletedAt: IsNull() } });
    if (!wallet) {
      throw new NotFoundException('wallet not found');
    }

    const [details, walletUsers] = await Promise.all([
      this.walletDetailsRepository.find({
        where: { walletId, deletedAt: IsNull() },
        order: { date: 'DESC', id: 'DESC' },
        relations: ['walletUsers', 'category'],
      }),
      this.walletUserRepository.find({
        where: { walletId, deletedAt: IsNull() },
        order: { id: 'ASC' },
      }),
    ]);

    const walletUser = walletUsers.find((item) => item.isAdmin) ?? null;

    const mappedDetails = details.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      payment_user_id: item.paymentWalletUserId,
      unit: item.unit,
      symbol_operation_type_id: item.symbolOperationTypeId,
      select_all: item.selectAll,
      is_personal: item.isPersonal,
      value: Number(item.value).toFixed(4),
      date: this.formatDateOnly(item.date),
      note: item.note,
      users: (item.walletUsers ?? []).map((walletUser) => walletUser.id),
      checkout_by: item.checkoutById,
      created_by: item.createdById,
      updated_by: item.updatedById,
      created_at: this.formatDate(item.createdAt),
      updated_at: this.formatDate(item.updatedAt),
      checkout_at: item.checkoutAt ? this.formatDate(item.checkoutAt) : null,
      exchange_rates: null,
      rates: item.rates === null || item.rates === undefined ? null : Number(item.rates),
      splits: item.splits ?? [],
      category: item.category
        ? {
            id: item.category.id,
            parent_id: item.category.parentId ?? null,
            wallet_id: item.category.walletId ?? null,
            name: item.category.name,
            icon: item.category.icon ?? null,
            created_at: this.formatDate(item.category.createdAt),
            updated_at: this.formatDate(item.category.updatedAt),
            deleted_at: item.category.deletedAt ? this.formatDate(item.category.deletedAt) : null,
          }
        : null,
    }));

    const mappedWalletUsers = walletUsers.map((item) => ({
      id: item.id,
      wallet_id: item.walletId,
      user_id: item.userId,
      name: item.name,
      is_admin: item.isAdmin,
      notify_enable: item.notifyEnable,
      created_at: this.formatUtcDate(item.createdAt),
      updated_at: this.formatUtcDate(item.updatedAt),
    }));

    const publicDetails = details.filter((item) => item.type === 1);

    const total = publicDetails.reduce(
      (acc, item) => {
        const numericValue = Number(item.value);
        if (item.symbolOperationTypeId === 1) {
          acc.income += numericValue;
        }
        if (item.symbolOperationTypeId === 2) {
          acc.expenses += numericValue;
        }
        return acc;
      },
      { income: 0, expenses: 0 },
    );

    return {
      wallet: {
        id: wallet.id,
        code: wallet.code,
        title: wallet.title,
        status: wallet.status,
        mode: 'multi',
        unit: wallet.unit,
        wallet_user: walletUser
          ? {
              id: walletUser.id,
              wallet_id: walletUser.walletId,
              user_id: walletUser.userId,
              name: walletUser.name,
              is_admin: walletUser.isAdmin,
              notify_enable: walletUser.notifyEnable,
              created_at: this.formatUtcDate(walletUser.createdAt),
              updated_at: this.formatUtcDate(walletUser.updatedAt),
            }
          : null,
        properties: wallet.properties ?? {},
        created_at: this.formatUtcDate(wallet.createdAt),
        updated_at: this.formatUtcDate(wallet.updatedAt),
        details: mappedDetails,
        wallet_users: mappedWalletUsers,
        total,
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

  private formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatUtcDate(date: Date): string {
    const utcFromTaipei = new Date(date.getTime() - 8 * 60 * 60 * 1000);
    return utcFromTaipei.toISOString().replace(/\.(\d{3})Z$/, '.$1000Z');
  }
}
