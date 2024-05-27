import { CreateUserDto, UpdateUserDto } from '../dto/user.input';
import { User } from 'src/user/domain/user';
import { Generate } from 'src/common/util/generate.factory';

export class UserMapper {
  static toDomain(
    dto: CreateUserDto,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  static toDomain(dto: UpdateUserDto): Partial<User>;

  //impl
  static toDomain(
    dto: CreateUserDto | UpdateUserDto,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> | Partial<User> {
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
