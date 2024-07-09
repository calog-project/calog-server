import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CachePort } from 'src/cache/domain/port/out/cache.port';

@Injectable()
export class CacheManageAdapter implements CachePort {
  constructor(@Inject(CACHE_MANAGER) private _cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const item = await this._cacheManager.get<T>(key);
    return item ? item : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this._cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this._cacheManager.del(key);
  }
}
