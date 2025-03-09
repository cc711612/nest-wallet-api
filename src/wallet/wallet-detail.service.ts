import { Injectable } from '@nestjs/common';
import { WalletDetail } from './interfaces/wallet-detail.interface';

@Injectable()
export class WalletDetailService {
  private walletDetails: WalletDetail[] = [];

  findAll(): WalletDetail[] {
    return this.walletDetails;
  }

  findOne(id: string): WalletDetail | undefined {
    return this.walletDetails.find(detail => detail.id === id);
  }

  create(walletDetail: WalletDetail): WalletDetail {
    this.walletDetails.push(walletDetail);
    return walletDetail;
  }

  update(id: string, walletDetail: WalletDetail): WalletDetail | undefined {
    const index = this.walletDetails.findIndex(detail => detail.id === id);
    if (index !== -1) {
      this.walletDetails[index] = walletDetail;
      return walletDetail;
    }
    return undefined;
  }

  remove(id: string): void {
    this.walletDetails = this.walletDetails.filter(detail => detail.id !== id);
  }
} 