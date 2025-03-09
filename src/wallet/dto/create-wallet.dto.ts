import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string = '';

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number = 0;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly unit: string = 'TWD';

  @IsOptional()
  readonly properties?: Record<string, any>;

  @IsEnum([1, 0])
  @IsOptional()
  readonly status: 1 | 0 = 1;
}