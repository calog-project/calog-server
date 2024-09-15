import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

import { EventPublishPort } from 'src/cache/domain/port/out/event-publish.port';

@Injectable()
export class RedisPublishAdapter implements EventPublishPort {
  constructor(@InjectRedis() private readonly _handler: Redis) {}

  async publishToChannel(channel: string, message: string): Promise<void> {
    await this._handler.publish(channel, message);
    return;
  }
}
