//내부 이벤트 핸들러 (외부 레디스, 카프카 사용 불가, 내부 이벤트 버스 nest/cqrs를 통해 사용)

import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { FollowedEvent } from '../../domain/followed.event';
import { FollowRequestedEvent } from '../../domain/follow-requested.event';

//
// @EventsHandler()
// export class UserCreatedHandler implements IEventHandler<> {
//   constructor() {}
// }

@EventsHandler(FollowedEvent)
export class FollowedEventHandler implements IEventHandler<FollowedEvent> {
  constructor(@Inject('REDIS_MESSAGE') private readonly _client: ClientProxy) {}
  handle(event: FollowedEvent) {
    this._client.emit(event.name, event);
  }
}

@EventsHandler(FollowRequestedEvent)
export class FollowRequestedEventHandler
  implements IEventHandler<FollowRequestedEvent>
{
  constructor(@Inject('REDIS_MESSAGE') private readonly _client: ClientProxy) {}
  handle(event: FollowRequestedEvent) {
    this._client.emit(event.name, event);
  }
}
