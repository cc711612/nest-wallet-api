import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetCodeWalletUserDto {
  @ApiProperty({ description: 'The search code for filtering wallets', required: false })
  @IsString()
  readonly code?: string;
}
