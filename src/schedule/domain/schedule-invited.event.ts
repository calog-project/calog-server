import { Event } from '../../common/domain/event';

export class ScheduleInvitedEvent extends Event {
  constructor(
    public readonly id: string,
    public readonly author: number,
    public readonly title: string,
    public readonly invitedIds: number[],
  ) {
    super(id, ScheduleInvitedEvent.name);
  }
}
