import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletUser } from '../entities/wallet-user.entity';
import { Wallet } from '../entities/wallet.entity';
import { WalletUserService } from './wallet-user.service';
import { WalletService } from './wallet.service';
import { WalletUserController } from './wallet-user.controller';
import { WalletController } from './wallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WalletUser, Wallet])],
  controllers: [WalletUserController, WalletController],
  providers: [WalletUserService, WalletService],
  exports: [WalletUserService, WalletService],
})
export class WalletModule {}