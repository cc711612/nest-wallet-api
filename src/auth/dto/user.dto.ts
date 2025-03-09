import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  @Transform(({ obj }) => obj.token)
  memberToken!: string;

  @Expose()
  @Transform(({ obj }) => obj.jwt)
  jwt!: string;

  @Expose()
  @Transform(({ obj }) => obj.wallet ? { id: obj.wallet.id, code: obj.wallet.code } : null)
  wallet!: {
    id: number;
    code: string;
  };

  @Expose()
  @Transform(({ obj }) => obj.walletUsers.map((walletUser: any) => ({
    id: walletUser.id,
    walletId: walletUser.walletId,
    userId: walletUser.userId,
    name: walletUser.name,
    token: walletUser.token,
    isAdmin: walletUser.isAdmin,
    notifyEnable: walletUser.notifyEnable,
    createdAt: walletUser.createdAt,
    updatedAt: walletUser.updatedAt,
    deletedAt: walletUser.deletedAt,
  })))
  walletUsers!: Array<{
    id: number;
    walletId: number;
    userId: number;
    name: string;
    token: string;
    isAdmin: boolean;
    notifyEnable: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;

  @Expose()
  @Transform(({ obj }) => obj.devices.map((device: any) => ({
    id: device.id,
    userId: device.userId,
    walletUserId: device.walletUserId,
    platform: device.platform,
    deviceName: device.deviceName,
    fcmToken: device.fcmToken,
    expiredAt: device.expiredAt,
    createdAt: device.createdAt,
    updatedAt: device.updatedAt,
    deletedAt: device.deletedAt,
  })))
  devices!: Array<{
    id: number;
    userId: number;
    walletUserId: number | null;
    platform: string;
    deviceName: string;
    deviceType: string;
    fcmToken: string;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;

  @Expose()
  notifies!: Array<{
    id: number;
    name: string;
    walletId: number;
    notifyEnable: boolean;
    wallets: {
      id: number;
      code: string;
    };
  }>;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}