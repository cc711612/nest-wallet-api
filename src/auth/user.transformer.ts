import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { User } from '../entities/user.entity';

export class UserTransformer {
  static transform(user: User): UserDto {
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }
}