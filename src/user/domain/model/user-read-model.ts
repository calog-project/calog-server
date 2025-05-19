export class UserReadModel {
  id: number;
  email: string;
  provider: string;
  nickname: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserSummary {
  id: number;
  email: string;
  nickname: string;
  image?: string;
}

export class UserProfile extends UserReadModel {
  followerCount: number;
  followingCount: number;
  isMutualFollow: boolean;
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
``;
