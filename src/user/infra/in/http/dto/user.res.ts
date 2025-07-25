import {
  UserSummary,
  FollowRelationStatus,
  PagedOffsetBaseSearchUsers,
  PagedCursorBaseSearchUsers,
  FollowUser,
  PagedFollowUsers,
} from '../../../../domain/model/user-read-model';
import {
  BasePaginationResponse,
  CursorPaginatedResponse,
  PaginatedResponse,
} from '../../../../../common/dto/pagination-response.dto';

export class ShowUserResDto {
  id: number;
  email: string;
  provider: string;

  image: string;
  nickname: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  followerCount: number;
  followingCount: number;

  followStatus: FollowRelationStatus;
  isMutualFollow: boolean;

  constructor(input: ShowUserResDto) {
    this.id = input.id;
    this.email = input.email;
    this.provider = input.provider;

    this.image = input.image;
    this.nickname = input.nickname;
    this.description = input.description;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;

    this.followerCount = input.followerCount;
    this.followingCount = input.followingCount;

    this.followStatus = input.followStatus;

    this.isMutualFollow = input.isMutualFollow;
  }
}

export class ShowFollowUsersResDto extends CursorPaginatedResponse<
  FollowUser,
  number
> {
  users: FollowUser[];
  constructor(input: PagedFollowUsers) {
    super();
    this.users = input.items;
    this.limit = input.limit;
    this.cursor = input.marker;
    this.hasNext = input.hasNext;
  }
}

// export class ShowFollowUsersResDto extends BasePaginationResponse<number> {
//   users: FollowUser[];
//   constructor(input: PagedFollowUsers) {
//     super(input);
//   }
// }

export class SearchUsersByOffsetResDto {
  users: UserSummary[];
  limit: number;
  offset: number;

  constructor(input: PagedOffsetBaseSearchUsers) {
    this.users = input.items;
    this.limit = input.limit;
    this.offset = input.marker;
  }
}

export class SearchUsersByCursorResDto {
  users: UserSummary[];
  limit: number;
  cursor?: string;

  constructor(input: PagedCursorBaseSearchUsers) {
    this.users = input.items;
    this.limit = input.limit;
    this.cursor = input.marker;
  }
}
