import { Module } from '@nestjs/common';

import { CachePortSymbol } from './domain/port/out/cache.port';
import { EventPublishPortSymbol } from './domain/port/out/event-publish.port';
import { EventSubscribePortSymbol } from './domain/port/out/event-subscribe.port';

import { CacheManageAdapter } from './infra/out/persistence/adapter/cache-manage.adapter';
import { RedisPublishAdapter } from './infra/out/persistence/adapter/redis-publish.adapter';
import { RedisSubscribeAdapter } from './infra/out/persistence/adapter/redis-subscribe.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: CachePortSymbol,
      useClass: CacheManageAdapter,
    },
    {
      provide: EventPublishPortSymbol,
      useClass: RedisPublishAdapter,
    },
    {
      provide: EventSubscribePortSymbol,
      useClass: RedisSubscribeAdapter,
    },
  ],
  exports: [CachePortSymbol, EventPublishPortSymbol, EventSubscribePortSymbol],
})
export class CacheModule {}
