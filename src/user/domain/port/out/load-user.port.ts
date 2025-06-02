import { User } from '../../model/user';
import {
  UserReadModel,
  UserProfile,
  FollowEntityReadModel,
  FollowUser,
  PagedOffsetBaseSearchUsers,
  PagedCursorBaseSearchUsers,
} from '../../model/user-read-model';

export const LoadUserPortSymbol = Symbol('LoadUserPort');

export interface LoadUserPort {
  loadUserAggregateById(id: number): Promise<User | null>;

  loadUserAggregateByEmail(email: string): Promise<User | null>;

  findById(targetId: number, viewerId?: number): Promise<UserProfile | null>;

  findByIds(ids: number[]): Promise<UserProfile[]>;

  findByEmail(email: string): Promise<UserProfile | null>;

  findByNickname(nickname: string): Promise<User | null>;

  findFollowRelation(
    followerId: number,
    followingId: number,
  ): Promise<FollowEntityReadModel | null>;

  findFollowers(userId: number, onlyApproved: boolean): Promise<FollowUser[]>;

  findFollowing(userId: number, onlyApproved: boolean): Promise<FollowUser[]>;

  searchUsersByEmailOrNicknameUseOffset(
    keyword: string,
    limit: number,
    offset: number,
  ): Promise<PagedOffsetBaseSearchUsers>;

  searchUsersByEmailOrNicknameUseCursor(
    keyword: string,
    limit: number,
    cursor: string,
  ): Promise<PagedCursorBaseSearchUsers>;
}
