import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialBindDto {
  @ApiProperty({ example: 'AbCdEf123456', description: 'checkBind 回傳的 token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
