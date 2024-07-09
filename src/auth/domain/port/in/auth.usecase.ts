import { User } from 'src/user/domain/user';

export const AuthUseCaseSymbol = Symbol('AuthUseCase');

export interface AuthUseCase {
  login(userInfo: Pick<User, 'email' | 'password'>): Promise<object>;
  validate(): Promise<any>;
  refresh(): Promise<any>;
}
//
