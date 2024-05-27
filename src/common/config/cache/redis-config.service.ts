import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor() {}
  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      type: 'single',
      url: '',
      options: '',
    } as RedisModuleOptions;
  }
}
