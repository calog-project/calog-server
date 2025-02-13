import { User, UserPrimitives } from '../../model/user';
import { Follower, Following } from '../../model/user-read-model';

export const LoadUserPortSymbol = Symbol('LoadUserPort');

export interface LoadUserPort {
  findById(id: number): Promise<User | null>;

  findByIds(ids: number[]): Promise<User[] | null>;

  findByEmail(email: string): Promise<User | null>;

  findByNickname(nickname: string): Promise<User | null>;

  findFollowers(userId: number, onlyApproved: boolean): Promise<Follower[]>;

  findFollowing(userId: number, onlyApproved: boolean): Promise<Following[]>;
}
