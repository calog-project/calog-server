import { User } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  public static toDomain(raw: UserEntity): User {
    const user = User.create({
      ...raw,
    });
    return user;
  }

  // public static toDomains(raws: UserEntity[]): User[] {
  //   return;
  // }

  public static toOrmEntity(user: User): UserEntity {
    const record = new UserEntity();
    const userData = user.toPrimitives();
    const numbericId =
      typeof userData.id === 'number' ? userData.id : parseInt(userData.id);
    if (numbericId) {
      record.id = numbericId;
    }
    record.email = userData.email;
    record.password = userData.password;
    record.provider = userData.provider;
    record.nickname = userData.nickname;
    record.description = userData.description;
    record.image = userData.image;
    return record;
  }

  // public static toOrmEntiteis(users: User[]): UserEntity[] {
  //   return;
  // }
}
