import { UserPrimitives } from './user';

export class Follower {
  isApproved: boolean;
  follower: UserPrimitives;
}

export class Following {
  isApproved: boolean;
  following: UserPrimitives;
}

export class SearchedUser {
  id: number;
  email: string;
  nickname: string;
}
