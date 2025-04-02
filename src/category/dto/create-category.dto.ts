import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  readonly name: string = '';

  @ApiProperty({ description: 'The parent category ID (if this is a sub-category)', required: false })
  @IsNumber()
  @IsOptional()
  readonly parentId?: number;

  @ApiProperty({ description: 'The wallet ID this category belongs to', required: false })
  @IsNumber()
  @IsOptional() 
  readonly walletId?: number;

  @ApiProperty({ description: 'The icon for the category', required: false })
  @IsString()
  @IsOptional()
  readonly icon?: string;
}