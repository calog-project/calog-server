import { User } from 'src/user/domain/user';
import { UserEntity } from '../entity/user.entity';
import { BaseMapper } from 'src/common/base/base.mapper';

// export class UserMapper implements BaseMapper<User, UserEntity> {
export class UserMapper {
  public static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id.toString();
    user.email = raw.email;
    user.password = raw.password;
    user.provider = raw.provider;
    user.nickname = raw.nickname;
    user.description = raw.description;
    if (raw.image) {
      user.image = raw.image;
    } else if (raw.image === null) {
      user.image = null;
    }
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    return user;
  }

  // public static toDomains(raws: UserEntity[]): User[] {
  //   return;
  // }

  public static toOrmEntity(user: User | Partial<User>): UserEntity {
    const entity = new UserEntity();
    const numbericId =
      typeof user.id === 'number' ? user.id : parseInt(user.id);
    if (numbericId) {
      entity.id = numbericId;
    }
    entity.email = user.email;
    entity.password = user.password;
    entity.provider = user.provider;
    entity.nickname = user.nickname;
    entity.description = user.description || null;
    entity.image = user.image || null;
    return entity;
  }

  // public static toEntiteis(users: User[]): UserEntity[] {
  //   return;
  // }
}
