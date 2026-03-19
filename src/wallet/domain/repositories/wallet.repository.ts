import { Wallet } from '../../entities/wallet.entity';
import { FindAllWalletsDto } from '../../dto/find-all-wallets.dto';
import { WalletListResult, WalletUsersView } from '../entities/wallet.aggregate';

export const WALLET_REPOSITORY = 'WALLET_REPOSITORY';

export interface WalletRepository {
  create(walletData: Partial<Wallet>): Promise<Wallet>;
  findAll(query: FindAllWalletsDto, userId: number): Promise<WalletListResult>;
  findOne(id: number, userId: number): Promise<Wallet | null>;
  update(id: number, updateData: Partial<Wallet>): Promise<void>;
  remove(id: number): Promise<void>;
  findUsersByWalletCode(code: string): Promise<WalletUsersView>;
}
