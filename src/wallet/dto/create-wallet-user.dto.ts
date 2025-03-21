import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletUserDto {
  @ApiProperty({ description: 'The ID of the wallet' })
  @IsNumber()
  walletId!: number;

  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  userId!: number;

  @ApiProperty({ description: 'The name of the wallet user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The token of the wallet user', required: false })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({ description: 'The agent of the wallet user', required: false })
  @IsString()
  @IsOptional()
  agent?: string;

  @ApiProperty({ description: 'The IP address of the wallet user', required: false })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty({ description: 'Whether the user is an admin', required: false })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Whether notifications are enabled for the user', required: false })
  @IsBoolean()
  @IsOptional()
  notifyEnable?: boolean;
}