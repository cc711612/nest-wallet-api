import { Module } from '@nestjs/common';
import { WalletDetailController } from '../wallet/wallet-detail.controller';
import { WalletDetailService } from '../wallet/wallet-detail.service';

@Module({
  controllers: [WalletDetailController],
  providers: [WalletDetailService],
  exports: [WalletDetailService],
})
export class WalletDetailModule {} 