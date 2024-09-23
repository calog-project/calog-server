import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AllConfigType } from '../config.type';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}
  createCacheOptions():
    | CacheModuleOptions<Record<string, any>>
    | Promise<CacheModuleOptions<Record<string, any>>> {
    return {
      store: redisStore,
      host: this.configService.get('redis.cacheHost', { infer: true }),
      port: this.configService.get('redis.cachePort', { infer: true }),
      password: this.configService.get('redis.cacheToken', { infer: true }),
    } as CacheModuleOptions;
  }
}
