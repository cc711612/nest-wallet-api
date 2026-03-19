import { PartialType } from '@nestjs/swagger';
import { CreateWalletUserDto } from './create-wallet-user.dto';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletUserDto {
  @ApiProperty({ description: 'The ID of the wallet user' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number = 0;

  @ApiProperty({ description: 'The ID of the wallet' })
  @IsNumber()
  @IsNotEmpty()
  readonly walletId: number = 0;

  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number = 0;

  @ApiProperty({ description: 'The role of the user in the wallet', required: false })
  @IsString()
  @IsOptional()
  readonly role?: string;

  @ApiProperty({ description: 'The display name of the wallet user', required: false })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ description: 'Whether notify is enabled for this user', required: false })
  @IsOptional()
  readonly notifyEnable?: boolean;

  @ApiProperty({ description: 'The status of the wallet user', enum: [1, 0], default: 1 })
  @IsEnum([1, 0])
  @IsOptional()
  readonly status: 1 | 0 = 1;
}
