import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SocialUnBindDto {
  @ApiProperty({ example: 9, description: '社群類型（1~13）' })
  @IsInt()
  @Min(1)
  @Max(13)
  socialType!: number;
}
