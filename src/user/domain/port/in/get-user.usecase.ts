import { User, UserPrimitives } from 'src/user/domain/model/user';
import {
  GetFollowerQuery, GetFollowingQuery,
  SearchUsersQuery,
} from '../../../application/query/user.query';
import { FollowUser, SearchedUser } from '../../model/user-read-model';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUserById(id: number): Promise<User | null>;

  getUserByEmail(email: string): Promise<User | null>;

  isExistsEmail(email: string): Promise<boolean>;

  isExistsNickname(nickname: string): Promise<boolean>;

  getFollowers(query: GetFollowerQuery): Promise<FollowUser[]>;

  getFollowings(query: GetFollowingQuery): Promise<FollowUser[]>;

  searchUsers(query: SearchUsersQuery): Promise<SearchedUser[]>;
}
