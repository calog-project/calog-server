import { User } from 'src/user/domain/model/user';
import { ShowUserResDto } from '../dto/user.res';
import { CreateUserDto, UpdateUserDto } from '../dto/user.req';
import { UpdateUserCommand } from '../../../../application/command/user.command';

export class UserMapper {
  static toDomain(
    dto: CreateUserDto,
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  static toDomain(dto: { id: number } & UpdateUserDto): UpdateUserCommand;

  //impl
  static toDomain(
    dto: CreateUserDto | ({ id: number } & UpdateUserDto),
  ):
    | Omit<User, 'id' | 'createdAt' | 'updatedAt'>
    | Partial<User>
    | UpdateUserCommand {
    if (dto instanceof CreateUserDto) {
      const user = User.create({
        email: 'email' in dto ? dto.email : undefined,
        password: 'password' in dto ? dto.password : undefined,
        provider: 'provider' in dto ? dto.provider : undefined,
        nickname: dto.nickname,
        image: dto.image,
        description: dto.description,
      });
      return user;
    } else if ('id' in dto) {
      return new UpdateUserCommand(
        dto.id,
        dto.nickname,
        dto.image,
        dto.description,
      );
    }
  }

  static toDto(user: Partial<User>): ShowUserResDto {
    const userData = user.toPrimitives();
    const fullUser = new ShowUserResDto({
      id: userData.id,
      email: userData.email,
      provider: userData.provider,

      image: userData.image,
      nickname: userData.nickname,
      description: userData.description,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
    return fullUser;
  }
}
