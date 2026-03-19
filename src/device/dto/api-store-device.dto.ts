import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ApiStoreDeviceDto {
  @ApiProperty({ example: 190, description: 'wallet user id' })
  @IsInt()
  @Min(1)
  wallet_user_id!: number;

  @ApiPropertyOptional({ example: 1, description: 'user id (optional)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  user_id?: number;

  @ApiProperty({ example: 'ios' })
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiProperty({ example: 'iPhone 15' })
  @IsString()
  @IsNotEmpty()
  device_name!: string;

  @ApiProperty({ example: 'mobile' })
  @IsString()
  @IsNotEmpty()
  device_type!: string;

  @ApiProperty({ example: 'fcm-token' })
  @IsString()
  @IsNotEmpty()
  fcm_token!: string;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  expired_at?: string;
}
