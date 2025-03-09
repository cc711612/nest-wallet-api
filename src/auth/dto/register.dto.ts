import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'The account of the user' })
  account!: string;

  @ApiProperty({ description: 'The password of the user' })
  password!: string;

  @ApiProperty({ description: 'The name of the user' })
  name!: string;
}