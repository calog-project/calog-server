import { Entity } from './entity';
import { Event } from './event';
import { UniqueID } from './unique-id';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _events: Event[] = [];

  get id(): UniqueID {
    return this._id;
  }
  get dbId(): number {
    return this._dbId;
  }
  get events(): Event[] {
    return this._events;
  }

  protected addEvent(event: Event): void {
    this._events.push(event);
  }

  public clearEvents(): void {
    this._events.splice(0, this._events.length);
  }
}
