import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletUserService } from './wallet-user.service';
import { WalletUser } from './entities/wallet-user.entity';
import { WalletGateway } from './wallet.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([WalletUser])],
  providers: [WalletUserService, WalletGateway],
  exports: [WalletUserService],
})
export class WalletUserModule {}
