import {
  GetUserByIdQuery,
  GetUserByEmailQuery,
  GetFollowerQuery,
  GetFollowingQuery,
  SearchUsersQuery,
} from '../../../application/query/user.query';
import {
  UserReadModel,
  UserProfile,
  FollowUser,
  SearchedUser,
} from '../../model/user-read-model';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUserById(query: GetUserByIdQuery): Promise<UserProfile | null>;

  getUserByEmail(query: GetUserByEmailQuery): Promise<UserProfile | null>;

  isExistsEmail(email: string): Promise<boolean>;

  isExistsNickname(nickname: string): Promise<boolean>;

  getFollowers(query: GetFollowerQuery): Promise<FollowUser[]>;

  getFollowings(query: GetFollowingQuery): Promise<FollowUser[]>;

  searchUsers(query: SearchUsersQuery): Promise<SearchedUser[]>;
}
