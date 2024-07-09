import { Module } from '@nestjs/common';

import { CachePortSymbol } from './domain/port/out/cache.port';
import { CacheManageAdapter } from './infra/out/persistence/adapter/cache-manage.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: CachePortSymbol,
      useClass: CacheManageAdapter,
    },
  ],
  exports: [CachePortSymbol],
})
export class CacheModule {}
