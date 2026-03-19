import { Device } from '../../entities/device.entity';

export const DEVICE_REPOSITORY = 'DEVICE_REPOSITORY';

export interface DeviceRepository {
  findByUserId(userId: number): Promise<Device[]>;
  findByWalletUserId(walletUserId: number): Promise<Device[]>;
  findIdByTokenAndOwner(fcmToken: string, walletUserId: number, userId: number): Promise<number | null>;
  update(deviceId: number, attributes: Partial<Device>): Promise<void>;
  create(attributes: Partial<Device>): Promise<void>;
}
