import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllWalletsDto {
  @ApiProperty({ description: 'The page number for pagination', required: false })
  @IsNumber()
  @IsOptional()
  readonly page?: number;

  @ApiProperty({ description: 'The number of items per page for pagination', required: false })
  @IsNumber()
  @IsOptional()
  readonly limit?: number;

  @ApiProperty({ description: 'The search keyword for filtering wallets', required: false })
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiProperty({ description: 'The status of the wallets to filter by', enum: [1, 0], required: false })
  @IsEnum([1, 0])
  @IsOptional()
  readonly status?: 1 | 0;
}
