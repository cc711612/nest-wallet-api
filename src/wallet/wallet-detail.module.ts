import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletDetailService } from '../wallet/wallet-detail.service';
import { ApiWalletDetailController } from './api-wallet-detail.controller';
import { ApiWalletDetailService } from './api-wallet-detail.service';
import { Wallet } from './entities/wallet.entity';
import { WalletDetails } from './entities/wallet-details.entity';
import { WalletUser } from './entities/wallet-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletDetails, WalletUser])],
  controllers: [ApiWalletDetailController],
  providers: [WalletDetailService, ApiWalletDetailService],
  exports: [WalletDetailService],
})
export class WalletDetailModule {} 
