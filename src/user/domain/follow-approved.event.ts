import { Event } from '../../common/domain/event';

export class FollowApprovedEvent extends Event {
  constructor(
    public readonly followerId: number,
    public readonly followingId: number,
  ) {
    super(followerId.toString(), 'user.follow-approved');
  }
}
