import { Event } from '../../common/domain/event';

export class ScheduleCreatedEvent extends Event {
  constructor(
    public readonly id: string,
    public readonly author: number,
    public readonly joiner: number[],
    public readonly title: string,
  ) {
    super(id, ScheduleCreatedEvent.name);
  }
}
