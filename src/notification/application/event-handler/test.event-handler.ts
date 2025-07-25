import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Event } from '../../../common/domain/event';

export class TestEvent extends Event {
  constructor(
    public readonly id: string,
    public readonly author: number,
    public readonly joiner: number[],
    public readonly title: string,
  ) {
    super(id, TestEvent.name);
  }
}

@EventsHandler(TestEvent)
export class TestEventHandler implements IEventHandler<TestEvent> {
  constructor(@Inject('REDIS_MESSAGE') private readonly _client: ClientProxy) {}
  async handle(event: TestEvent): Promise<any> {
    console.log('(CQRS) In App Test Event Handling');
    this._client.emit('common.test', event);
  }
}
