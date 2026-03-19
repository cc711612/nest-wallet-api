import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { DeviceRepository } from '../../domain/repositories/device.repository';

@Injectable()
export class TypeormDeviceRepository implements DeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  findByUserId(userId: number): Promise<Device[]> {
    return this.deviceRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  findByWalletUserId(walletUserId: number): Promise<Device[]> {
    return this.deviceRepository.find({
      where: {
        walletUserId,
        deletedAt: IsNull(),
      },
    });
  }

  async findIdByTokenAndOwner(fcmToken: string, walletUserId: number, userId: number): Promise<number | null> {
    const query = this.deviceRepository
      .createQueryBuilder('device')
      .where('device.fcm_token = :fcmToken', { fcmToken })
      .andWhere('device.deleted_at IS NULL');

    if (walletUserId > 0 || userId > 0) {
      query.andWhere(
        new Brackets((qb) => {
          if (walletUserId > 0) {
            qb.where('device.wallet_user_id = :walletUserId', { walletUserId });
          }
          if (userId > 0) {
            if (walletUserId > 0) {
              qb.orWhere('device.user_id = :userId', { userId });
            } else {
              qb.where('device.user_id = :userId', { userId });
            }
          }
        }),
      );
    }

    const found = await query.select('device.id', 'id').getRawOne<{ id: number | string }>();
    if (!found) {
      return null;
    }
    return Number(found.id);
  }

  async update(deviceId: number, attributes: Partial<Device>): Promise<void> {
    await this.deviceRepository.update(deviceId, attributes);
  }

  async create(attributes: Partial<Device>): Promise<void> {
    const device = this.deviceRepository.create(attributes);
    await this.deviceRepository.save(device);
  }
}
