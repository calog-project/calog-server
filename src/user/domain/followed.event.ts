import { Event } from '../../common/domain/event';

export class FollowedEvent extends Event {
  constructor(
    public readonly receiverId: number,
    public readonly followerId: number,
    public readonly followerNickname: string,
  ) {
    super(followerId.toString(), 'user.followed');
  }
}
