import { Event } from '../../common/domain/event';

export class FollowRequestedEvent extends Event {
  constructor(
    public readonly followerId: number,
    public readonly followingId: number,
  ) {
    super(followerId.toString(), 'user.follow-requested');
  }
}
