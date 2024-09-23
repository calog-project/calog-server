import { User } from 'src/user/domain/user';
import { AuthUser } from '../../authUser';

export const AuthUseCaseSymbol = Symbol('AuthUseCase');

export interface AuthUseCase {
  login(userInfo: Pick<User, 'email' | 'password'>): Promise<AuthUser>;
  validate(): Promise<any>;
  refresh(refreshToken: string, userId: number): Promise<any>;
  compareRefreshToken(refreshToken: string, userId: string): Promise<boolean>;
}
//
