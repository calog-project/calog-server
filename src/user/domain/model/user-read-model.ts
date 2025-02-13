import { UserPrimitives } from './user';

export class Follower {
  isApproved: boolean;
  follower: UserPrimitives;
}

export class Following {
  isApproved: boolean;
  following: UserPrimitives;
}
