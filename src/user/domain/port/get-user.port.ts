import { UserEntity } from 'src/user/infra/persistence/entity/user.entity';
import { User } from '../user';

export interface GetUserPort {
  findOne(): Promise<Partial<User> | null>;
}
