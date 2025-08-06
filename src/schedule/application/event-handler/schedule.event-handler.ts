import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  LoadUserPortSymbol,
  LoadUserPort,
} from '../../../user/domain/port/out/load-user.port';
import { ScheduleCreatedEvent } from '../../domain/schedule-created.event';
import { CategoryDeletedEvent } from '../../domain/category-deleted.event';
import { ScheduleInvitedEvent } from '../../domain/schedule-invited.event';

@EventsHandler(ScheduleCreatedEvent)
export class ScheduleCreatedHandler
  implements IEventHandler<ScheduleCreatedEvent>
{
  constructor(@Inject('REDIS_MESSAGE') private readonly _client: ClientProxy) {}
  async handle(event: ScheduleCreatedEvent): Promise<any> {
    this._client.emit('schedule.created', event);
    //알림 이벤트
  }
}

@EventsHandler(ScheduleInvitedEvent)
export class ScheduleInvitedHandler
  implements IEventHandler<ScheduleInvitedEvent>
{
  constructor(
    @Inject('REDIS_MESSAGE') private readonly _client: ClientProxy,
    @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async handle(event: ScheduleInvitedEvent): Promise<any> {
    const author = await this._loadUserPort.loadUserAggregateById(event.author);
    this._client.emit('schedule.invited', {
      receiverId: event.author,
      scheduleId: event.id,
      scheduleTitle: event.title,
      inviterId: event.author,
      inviterNickname: author.props.nickname,
      inviteeIds: event.invitedIds,
    });
  }
}

@EventsHandler(CategoryDeletedEvent)
export class CategoryDeletedScheduleResetHandler
  implements IEventHandler<CategoryDeletedEvent>
{
  constructor() {}
  async handle(event: CategoryDeletedEvent): Promise<any> {}
}
