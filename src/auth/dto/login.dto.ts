import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The account of the user' })
  @IsString()
  @IsNotEmpty()
  readonly account: string = '';

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  readonly password: string = '';
}