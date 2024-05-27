import { User } from '../../user';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUserById(id: number): Promise<User | null>;

  getUserByEmail(email: string): Promise<User | null>;

  checkEmail(email: string): Promise<boolean>;
  // getUserByEmailOrNickname(
  //   options: Partial<{ email: string; nickname: string }>,
  // ): Promise<User | null>;
}
