import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApiWalletAuthRegisterDto {
  @ApiProperty({ example: 'zfTMK6Dh', description: '帳本代碼' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'new-wallet-member', description: '單一註冊名稱' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
