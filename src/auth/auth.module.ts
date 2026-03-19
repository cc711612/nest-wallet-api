import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthController } from './api-auth.controller';
import { ApiSocialController } from './api-social.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { WalletUserModule } from '../wallet/wallet-user.module';
import { SocialService } from './social.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1y' },
    }),
    ConfigModule,
    WalletUserModule,
  ],
  controllers: [ApiAuthController, ApiSocialController],
  providers: [AuthService, SocialService],
  exports: [AuthService],
})
export class AuthModule {}
