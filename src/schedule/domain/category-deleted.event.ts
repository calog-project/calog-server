import { Event } from '../../common/domain/event';

export class CategoryDeletedEvent extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly categoryId: number,
    public readonly userId: number,
  ) {
    super(aggregateId, CategoryDeletedEvent.name);
  }
}
