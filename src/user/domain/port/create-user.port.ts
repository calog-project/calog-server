import { User } from '../user';

export interface CreateUserPort {
  saveUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
}
