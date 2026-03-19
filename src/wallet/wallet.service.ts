import { Inject, Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { WALLET_REPOSITORY, WalletRepository } from './domain/repositories/wallet.repository';

@Injectable()
export class WalletService {
  constructor(@Inject(WALLET_REPOSITORY) private readonly walletRepository: WalletRepository) {}

  create(walletData: Partial<Wallet>) {
    return this.walletRepository.create(walletData);
  }

  findAll(query: FindAllWalletsDto, userId: number) {
    return this.walletRepository.findAll(query, userId);
  }

  findOne(id: number, userId: number) {
    return this.walletRepository.findOne(id, userId);
  }

  async update(id: number, updateData: Partial<Wallet>) {
    await this.walletRepository.update(id, updateData);
    return { updated: true };
  }

  async remove(id: number) {
    await this.walletRepository.remove(id);
    return { deleted: true };
  }

  findUsersByWalletCode(code: string) {
    return this.walletRepository.findUsersByWalletCode(code);
  }
}
