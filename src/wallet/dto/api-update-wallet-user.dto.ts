import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApiUpdateWalletUserDto {
  @ApiPropertyOptional({ example: 'Roy', description: '成員名稱' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: true, description: '是否開啟通知' })
  @IsBoolean()
  @IsOptional()
  notify_enable?: boolean;
}
