import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ description: 'The title of the wallet' })
  @IsString()
  @IsNotEmpty()
  readonly title: string = '';

  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number = 0;

  @ApiProperty({ description: 'The code of the wallet', required: false })
  @IsString()
  @IsOptional()
  readonly code?: string;

  @ApiProperty({ description: 'The unit of the wallet', default: 'TWD' })
  @IsString()
  @IsOptional()
  readonly unit: string = 'TWD';

  @ApiProperty({ description: 'Additional properties of the wallet', required: false })
  @IsOptional()
  readonly properties?: Record<string, any>;

  @ApiProperty({ description: 'The status of the wallet', enum: [1, 0], default: 1 })
  @IsEnum([1, 0])
  @IsOptional()
  readonly status: 1 | 0 = 1;
}