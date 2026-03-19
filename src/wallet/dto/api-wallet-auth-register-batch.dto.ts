import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApiWalletAuthRegisterBatchDto {
  @ApiProperty({ example: 'zfTMK6Dh', description: '帳本代碼' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    type: [String],
    example: ['batch-user-1', 'batch-user-2'],
    description: '批次註冊名稱清單（wallet-v2 相容欄位：name）',
  })
  @IsArray()
  name!: string[];
}
