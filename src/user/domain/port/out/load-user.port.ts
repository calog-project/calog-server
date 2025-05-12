import { User, UserPrimitives } from '../../model/user';
import {
  FollowEntityReadModel,
  FollowUser,
  SearchedUser,
} from '../../model/user-read-model';

export const LoadUserPortSymbol = Symbol('LoadUserPort');

export interface LoadUserPort {
  findById(id: number): Promise<User | null>;

  findByIds(ids: number[]): Promise<User[] | null>;

  findByEmail(email: string): Promise<User | null>;

  findByNickname(nickname: string): Promise<User | null>;

  findFollowRelation(
    followerId: number,
    followingId: number,
  ): Promise<FollowEntityReadModel | null>;

  findFollowers(userId: number, onlyApproved: boolean): Promise<FollowUser[]>;

  findFollowing(userId: number, onlyApproved: boolean): Promise<FollowUser[]>;

  searchUsersByEmailOrNickname(
    keyword: string,
    limit?: number,
    offset?: number,
  ): Promise<SearchedUser[]>;
}
