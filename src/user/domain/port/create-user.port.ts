import { User } from '../user';
import { UserEntity } from 'src/user/infra/persistence/entity/user.entity';

export interface CreateUserPort {
  saveUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
}
