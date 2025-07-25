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
  PagedFollowUsers,
  PagedOffsetBaseSearchUsers,
  PagedCursorBaseSearchUsers,
} from '../../model/user-read-model';

export const GetUserUseCaseSymbol = Symbol('GetUserUseCase');

export interface GetUserUseCase {
  getUserById(query: GetUserByIdQuery): Promise<UserProfile | null>;

  getUserByEmail(query: GetUserByEmailQuery): Promise<UserProfile | null>;

  isExistsEmail(email: string): Promise<boolean>;

  isExistsNickname(nickname: string): Promise<boolean>;

  getFollowers(query: GetFollowerQuery): Promise<PagedFollowUsers>;

  getFollowings(query: GetFollowingQuery): Promise<PagedFollowUsers>;

  searchUsers(
    query: SearchUsersQuery,
  ): Promise<PagedOffsetBaseSearchUsers | PagedCursorBaseSearchUsers>;
}
