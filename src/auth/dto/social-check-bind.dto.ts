import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class SocialCheckBindDto {
  @ApiProperty({ example: 9, description: '社群類型（1~13）' })
  @IsInt()
  @Min(1)
  @Max(13)
  socialType!: number;

  @ApiProperty({ example: 'U1234567890abcdef', description: '社群識別值' })
  @IsString()
  @IsNotEmpty()
  socialTypeValue!: string;

  @ApiPropertyOptional({ example: 'Roy' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'roy@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'social-token' })
  @IsOptional()
  @IsString()
  token?: string;
}
