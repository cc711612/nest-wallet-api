import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllWalletsDto {
  @ApiProperty({ description: 'The page number for pagination', required: false })
  @IsNumber({}, { message: 'page must be a number conforming to the specified constraints' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  readonly page?: number;

  @ApiProperty({ description: 'The number of items per page for pagination', required: false })
  @IsNumber({}, { message: 'perPage must be a number conforming to the specified constraints' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  readonly perPage?: number;

  @ApiProperty({ description: 'The search keyword for filtering wallets', required: false })
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiProperty({ description: 'The status of the wallets to filter by', enum: [1, 0], required: false })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsEnum([1, 0])
  @IsOptional()
  readonly status?: 1 | 0;
}
