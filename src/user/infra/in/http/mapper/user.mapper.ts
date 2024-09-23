import { CreateUserDto, UpdateUserDto } from '../dto/user.req';
import { User } from 'src/user/domain/model/user';

export class UserMapper {
  static toDomain(
    dto: CreateUserDto,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  static toDomain(dto: UpdateUserDto): Partial<User>;

  //impl
  static toDomain(
    dto: CreateUserDto | UpdateUserDto,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> | Partial<User> {
    const user = User.create({
      email: dto.email,
      password: dto.password,
      provider: dto.provider,
      nickname: dto.nickname,
      image: dto.image,
      description: dto.description,
    });
    return user;
  }
  // static toDomain(dto : UpdateUserDto) {}

  private static toDto() {}
}
