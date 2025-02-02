import { User } from '../../model/user';

export const LoadUserPortSymbol = Symbol('LoadUserPort');

export interface LoadUserPort {
  findById(id: number): Promise<User | null>;

  findByIds(ids: number[]): Promise<User[] | null>;

  findByEmail(email: string): Promise<User | null>;

  findByNickname(nickname: string): Promise<User | null>;

  findFollower(): Promise<void>;
}
