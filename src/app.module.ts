import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { OptionsModule } from './options/options.module';
import { LogModule } from './log/log.module';
import { DeviceModule } from './device/device.module';
import { UserModule } from './user/user.module'
import { WalletDetailModule } from './wallet/wallet-detail.module';
import { WalletUser } from './entities/wallet-user.entity';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletDetailSplit } from './entities/wallet-detail-split.entity';
import { Device } from './entities/device.entity';
import { WalletDetails } from './entities/wallet-details.entity';
import * as dotenv from 'dotenv';
import { configureMiddlewares } from './routes';
dotenv.config();

console.log('Database Host:', process.env.DB_HOST);
console.log('Database Username:', process.env.DB_USERNAME);
console.log('Database Name:', process.env.DB_DATABASE);
console.log('JWT Secret:', process.env.JWT_SECRET);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        WalletUser,
        User,
        Wallet,
        WalletDetailSplit,
        Device,
        WalletDetails
      ],
      synchronize: false,
      // logging: true,
      entitySkipConstructor: true
    }),
    AuthModule,
    OptionsModule,
    LogModule,
    DeviceModule,
    UserModule,
    WalletModule,
    WalletDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    configureMiddlewares(consumer); // 使用中間件配置
  }
}