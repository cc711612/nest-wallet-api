import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWalletUserDto {
  @IsNumber()
  walletId!: number;

  @IsNumber()
  userId!: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsOptional()
  agent?: string;

  @IsString()
  @IsOptional()
  ip?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyEnable?: boolean;
} 