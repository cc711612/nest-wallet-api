import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { WalletUser } from './entities/wallet-user.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletUserService } from './wallet-user.service';
import { WalletService } from './wallet.service';
import { ApiWalletController } from './api-wallet.controller';
import { ApiWalletUserController } from './api-wallet-user.controller';
import { ApiWalletMemberController } from './api-wallet-member.controller';
import { ApiWalletAuthController } from './api-wallet-auth.controller';
import { ApiWalletAuthService } from './api-wallet-auth.service';
import { Device } from '../device/entities/device.entity';
import { WALLET_REPOSITORY } from './domain/repositories/wallet.repository';
import { TypeormWalletRepository } from './infrastructure/repositories/typeorm-wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletUser, Wallet, Device]), JwtModule.register({})],
  controllers: [
    ApiWalletController,
    ApiWalletUserController,
    ApiWalletMemberController,
    ApiWalletAuthController,
  ],
  providers: [
    WalletUserService,
    WalletService,
    ApiWalletAuthService,
    {
      provide: WALLET_REPOSITORY,
      useClass: TypeormWalletRepository,
    },
  ],
  exports: [WalletUserService, WalletService],
})
export class WalletModule {}
