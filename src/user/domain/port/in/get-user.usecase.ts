import { User } from 'src/user/domain/model/user';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUserById(id: number): Promise<User | null>;

  getUserByEmail(email: string): Promise<User | null>;

  isExistsEmail(email: string): Promise<boolean>;
  // getUserByEmailOrNickname(
  //   options: Partial<{ email: string; nickname: string }>,
  // ): Promise<User | null>;
}
