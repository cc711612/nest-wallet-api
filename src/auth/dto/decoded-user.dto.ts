import { IsString, IsNumber } from 'class-validator';

export class DecodedUserDto {
  @IsNumber()
  id: number = 0;

  @IsString()
  name: string = '';
}
