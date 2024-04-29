import { User } from '../user';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUser(id: number): Promise<User | null>;
}
