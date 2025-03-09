import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The account of the user' })
  account!: string;

  @ApiProperty({ description: 'The password of the user' })
  password!: string;
}