import { User } from 'src/user/domain/model/user';
import { ShowUserResDto } from '../dto/user.res';
import { CreateUserDto, UpdateUserDto } from '../dto/user.req';
import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
  UpdateUserCommand,
} from '../../../../application/command/user.command';
import {
  UserReadModel,
  UserProfile,
} from '../../../../domain/model/user-read-model';

export class UserMapper {
  // static toCommand<
  //   T extends
  //     | PostFollowCommand
  //     | UnfollowCommand
  //     | ApproveFollowCommand
  //     | RejectFollowCommand,
  // >(dto: ) {}

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

  static toDto(user: Partial<UserProfile>): ShowUserResDto {
    return new ShowUserResDto({
      id: user.id,
      email: user.email,
      provider: user.provider,

      image: user.image,
      nickname: user.nickname,
      description: user.description,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      followerCount: user.followerCount,
      followingCount: user.followingCount,
      isMutualFollow: user.isMutualFollow,
    });
  }
}
