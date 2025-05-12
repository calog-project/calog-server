import { UserPrimitives } from './user';

// @TODO user read model
export class UserReadModel {}

export class UserSummary {
  id: number;
  email: string;
  nickname: string;
  image?: string;
}

export class SearchedUser extends UserSummary {}

export class FollowUser {
  user: UserSummary;
  isApproved: boolean;
  isMutualFollow: boolean;
}

export class FollowEntityReadModel {
  followerId: number;
  followingId: number;
  isApproved: boolean;
}
