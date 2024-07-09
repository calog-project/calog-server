import { User } from '../../user';
/**
 * @TODO
 * findOne port 일반화 리팩토링
 */
export const LoadUserPortSymbol = Symbol('LoadUserPort');

export interface LoadUserPort {
  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;
  // findByEmailOrNickname(
  //   options: Partial<{ email: string; nickname: string }>,
  // ): Promise<User | null>;

  // findByNickname()
}
