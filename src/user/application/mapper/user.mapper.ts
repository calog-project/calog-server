import { CreateUserDto } from '../dto/user.input';
import { User } from 'src/user/domain/user';
import { Generate } from 'src/common/util/generate.factory';

export class UserMapper {
  // static toDomainEntity(dto: CreateUserDto): Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  // static toDomainEntity(dto: UpdateUserDto): Partial<User>;
  static toDomain(dto: CreateUserDto): Partial<User> {
    const user = new User();
    user.email = dto.email;
    user.password = dto.password;
    user.provider = dto.provider || 'local';
    user.nickname = dto.nickname || Generate.genNickname(dto.email);
    user.description = dto.description || null;
    user.image = dto.image || null;
    return user;
  }
  // static toDomainEntity(dto : UpdateUserDto) {}

  private static toDto() {}
}
