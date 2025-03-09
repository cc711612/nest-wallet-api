import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletUserService } from './wallet-user.service';
import { WalletUser } from '../entities/wallet-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletUser])],
  providers: [WalletUserService],
  exports: [WalletUserService],
})
export class WalletUserModule {}
