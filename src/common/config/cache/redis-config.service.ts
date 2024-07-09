import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { AllConfigType } from '../config.type';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}
  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    const redisConfig = this.configService.get('redis', { infer: true });
    return {
      type: 'single',
      url: `redis://default:${redisConfig.token}@${redisConfig.host}:${redisConfig.port}`,
      options: '',
    } as RedisModuleOptions;
  }
}
