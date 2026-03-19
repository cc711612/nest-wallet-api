import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY, DeviceRepository } from './domain/repositories/device.repository';
import { WalletUserService } from '../wallet/wallet-user.service';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DEVICE_REPOSITORY) private readonly deviceRepository: DeviceRepository,
    private readonly walletUserService: WalletUserService,
  ) {}

  async findDevicesByUserId(userId: number) {
    const walletOwner = await this.walletUserService.findByWalletAndUser(1, userId);
    const devices = walletOwner
      ? await this.deviceRepository.findByWalletUserId(walletOwner.id)
      : await this.deviceRepository.findByUserId(userId);

    return {
      devices: devices.map((device) => ({
        id: device.id,
        userId: device.userId,
        walletUserId: device.walletUserId,
        platform: device.platform,
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        fcmToken: device.fcmToken,
        expiredAt: device.expiredAt,
      })),
    };
  }

  async store(payload: {
    wallet_user_id: number;
    user_id?: number;
    platform: string;
    device_name: string;
    device_type: string;
    fcm_token: string;
    expired_at?: string;
  }) {
    const walletUserId = Number(payload.wallet_user_id || 0);
    const userId = Number(payload.user_id || 0);
    const fcmToken = payload.fcm_token;

    const currentId = await this.deviceRepository.findIdByTokenAndOwner(fcmToken, walletUserId, userId);

    const upsertPayload = {
      userId: userId > 0 ? userId : undefined,
      walletUserId: walletUserId > 0 ? walletUserId : undefined,
      platform: payload.platform,
      deviceName: payload.device_name,
      deviceType: payload.device_type,
      fcmToken,
      expiredAt: payload.expired_at ? new Date(payload.expired_at) : undefined,
      updatedAt: new Date(),
    };

    if (currentId !== null) {
      await this.deviceRepository.update(currentId, upsertPayload);
    } else {
      await this.deviceRepository.create(upsertPayload);
    }

    return {};
  }
}
