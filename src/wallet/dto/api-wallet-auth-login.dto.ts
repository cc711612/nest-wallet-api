import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApiWalletAuthLoginDto {
  @ApiProperty({ example: 'zfTMK6Dh', description: '帳本代碼' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Roy', description: '成員名稱' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
