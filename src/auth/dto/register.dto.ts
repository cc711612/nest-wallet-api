import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'The account of the user' })
  @IsString()
  @IsNotEmpty()
  readonly account: string = '';

  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name: string = '';

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  readonly password: string = '';
}