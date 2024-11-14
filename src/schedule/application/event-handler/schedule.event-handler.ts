import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ScheduleCreatedEvent } from '../../domain/schedule-created.event';

@EventsHandler(ScheduleCreatedEvent)
export class ScheduleCreatedHandler
  implements IEventHandler<ScheduleCreatedEvent>
{
  constructor(@Inject('REDIS_MESSAGE') private readonly _client: ClientProxy) {}
  async handle(event: ScheduleCreatedEvent): Promise<any> {
    this._client.emit('schedule.created', event);
  }
}
