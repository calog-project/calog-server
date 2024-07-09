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
      host: this.configService.get('redis.host', { infer: true }),
      port: this.configService.get('redis.port', { infer: true }),
      password: this.configService.get('redis.token', { infer: true }),
    } as CacheModuleOptions;
  }
}
