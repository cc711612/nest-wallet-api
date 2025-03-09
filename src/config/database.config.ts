import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { Device } from '../entities/device.entity';
import { Social } from '../entities/social.entity';
import { WalletUser } from '../entities/wallet-user.entity';
import { Category } from '../entities/category.entity';
import { WalletDetails } from '../entities/wallet-details.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User,
    Device,
    Social,
    Category,
    Wallet,
    WalletDetails,
    WalletUser,
  ],
  synchronize: false,
  autoLoadEntities: true,
  logging: process.env.NODE_ENV !== 'production',
}; 