import { User } from 'src/user/domain/model/user';
import { Token } from '../../token';

export const AuthUseCaseSymbol = Symbol('AuthUseCase');

export interface AuthUseCase {
  login(userInfo: Partial<User>): Promise<{ user: User; token: Token }>;
  logout(): Promise<void>;
  validate(): Promise<any>;
  refresh(userId: number): Promise<Token>;
  compareRefreshToken(refreshToken: string, userId: string): Promise<boolean>;
}
//
