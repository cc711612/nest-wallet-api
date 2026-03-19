import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { ApiDeviceController } from './api-device.controller';
import { DeviceService } from './device.service';
import { DEVICE_REPOSITORY } from './domain/repositories/device.repository';
import { TypeormDeviceRepository } from './infrastructure/repositories/typeorm-device.repository';
import { WalletUserModule } from '../wallet/wallet-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), WalletUserModule],
  controllers: [ApiDeviceController],
  providers: [
    DeviceService,
    {
      provide: DEVICE_REPOSITORY,
      useClass: TypeormDeviceRepository,
    },
  ],
  exports: [DeviceService],
})
export class DeviceModule {}
