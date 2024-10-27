// import { User } from 'src/user/domain/user';
import { User } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';
import { Mapper } from 'src/common/base/base.mapper';

export class UserMapper extends Mapper<User, UserEntity> {
  toDomain(record: UserEntity): User {
    const user = User.create(record);
    return user;
  }
  toPersistence(domain: User): UserEntity {
    const record = new UserEntity();
    return record;
  }
}
