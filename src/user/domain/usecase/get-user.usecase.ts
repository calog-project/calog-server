import { User } from '../user';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUser(id: number): Promise<User | null>;
  // getUserByEmailOrNickname(
  //   options: Partial<{ email: string; nickname: string }>,
  // ): Promise<User | null>;
}
