import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApiWalletAuthTokenLoginDto {
  @ApiProperty({ example: 'zfTMK6Dh', description: '帳本代碼' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: '8d6a...token', description: '成員登入 token' })
  @IsString()
  @IsNotEmpty()
  member_token!: string;
}
