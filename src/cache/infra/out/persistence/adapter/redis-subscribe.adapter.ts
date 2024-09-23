import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

import { EventSubscribePort } from 'src/cache/domain/port/out/event-subscribe.port';

@Injectable()
export class RedisSubscribeAdapter implements EventSubscribePort {
  constructor(@InjectRedis() private readonly _handler: Redis) {}

  async subscribeToChannel(channel: string) {
    await this._handler.subscribe(channel);
    return;
  }
}
