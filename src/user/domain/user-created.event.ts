import { Event } from '../../common/domain/event';

export class UserCreatedEvent extends Event {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly provider: string,
  ) {
    super(id, 'user.created');
  }
}
