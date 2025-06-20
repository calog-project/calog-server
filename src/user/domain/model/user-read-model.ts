import { PageResult, OffsetPageResult } from '../../../common/type/paging';

//DB 레벨의 팔로우 상태, DB 레벨은 레코드 유무로 NONE 판단
export enum FollowStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

//service, repository 레벨의 팔로우 상태
export enum FollowRequestStatus {
  NONE = 'none',
  PENDING = FollowStatus.PENDING,
  APPROVED = FollowStatus.APPROVED,
}

export interface FollowRelationStatus {
  sent: FollowRequestStatus;
  received: FollowRequestStatus;
}

//general user read model
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
  followStatus: FollowRelationStatus;
  isMutualFollow: boolean;
}

//searched user read model
export type PagedOffsetBaseSearchUsers = OffsetPageResult<UserSummary>;

export type PagedCursorBaseSearchUsers = PageResult<UserSummary, string>;

//follow user read model
export class FollowEntityReadModel {
  followerId: number;
  followingId: number;
  status: FollowStatus;
}

export class FollowUser {
  user: UserSummary;
  followStatus: FollowRelationStatus;
  isMutualFollow: boolean;
}

export type PagedFollowUser = PageResult<FollowUser, string>;
