import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id!: number;

  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'The member token of the user' })
  @Expose()
  @Transform(({ obj }) => obj.token)
  memberToken!: string;

  @ApiProperty({ description: 'The JWT of the user' })
  @Expose()
  @Transform(({ obj }) => obj.jwt)
  jwt!: string;

  @ApiProperty({ description: 'The wallet of the user', required: false })
  @Expose()
  @Transform(({ obj }) => obj.wallet ? { id: obj.wallet.id, code: obj.wallet.code } : null)
  wallet!: {
    id: number;
    code: string;
  };

  @ApiProperty({ description: 'The wallet users of the user' })
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

  @ApiProperty({ description: 'The devices of the user' })
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

  @ApiProperty({ description: 'The notifies of the user' })
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

  @ApiProperty({ description: 'The creation date of the user' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'The update date of the user' })
  @Expose()
  updatedAt!: Date;
}