import { User } from '../../user';

export interface CreateUserPort {
  save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
}
