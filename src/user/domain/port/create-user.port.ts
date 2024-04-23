import { User } from '../user';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');
export interface CreateUserPort {
  saveUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
}
