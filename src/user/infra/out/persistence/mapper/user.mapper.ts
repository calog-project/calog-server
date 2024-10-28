import { User } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  public static toDomain(raw: UserEntity): User {
    const domain = User.create({
      ...raw,
    });
    return domain;
  }

  public static toDomains(raws: UserEntity[]): User[] {
    return raws.map((raw) => User.create({ ...raw }));
  }

  public static toOrmEntity(domain: Partial<User>): UserEntity {
    const record = new UserEntity();
    const data = domain.toPrimitives();
    const parseId = typeof data.id === 'number' ? data.id : parseInt(data.id);
    if (parseId) {
      record.id = parseId;
    }
    record.email = data.email;
    record.password = data.password;
    record.provider = data.provider;
    record.nickname = data.nickname;
    record.description = data.description;
    record.image = data.image;
    return record;
  }

  // public static toOrmEntities(users: User[]): UserEntity[] {
  //   return;
  // }
}
