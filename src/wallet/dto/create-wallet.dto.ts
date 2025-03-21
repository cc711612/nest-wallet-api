import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { Transform } from 'class-transformer';

export class CreateWalletDto {
  @ApiProperty({ description: 'The title of the wallet' })
  @IsString()
  @IsNotEmpty()
  readonly title: string = '';

  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ obj }) => obj.user?.id)
  readonly userId: number = 0;

  @ApiProperty({ description: 'The code of the wallet', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value ?? randomBytes(4).toString('hex'))
  readonly code: string = randomBytes(4).toString('hex');

  @ApiProperty({ description: 'The unit of the wallet', default: 'TWD' })
  @IsString()
  @IsOptional()
  readonly unit: string = 'TWD';

  @ApiProperty({ description: 'The unitConfigurable of the wallet', default: false })
  @IsOptional()
  readonly unitConfigurable: boolean = false;

  @ApiProperty({ description: 'The decimalPlaces of the wallet', default: 0 })
  @IsOptional()
  readonly decimalPlaces: number = 0;

  @ApiProperty({ description: 'The status of the wallet', enum: [1, 0], default: 1 })
  @IsEnum([1, 0])
  @IsOptional()
  readonly status: 1 | 0 = 1;
}