import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { AllConfigType } from '../config.type';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  RedisOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}
  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    const redisConfig = this.configService.get('redis', { infer: true });
    return {
      type: 'single',
      url: `rediss://default:${redisConfig.pubToken}@${redisConfig.pubHost}:${redisConfig.pubPort}`,
      options: '',
    } as RedisModuleOptions;
  }
}

@Injectable()
export class MessageConfigService implements ClientsModuleOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}
  createClientOptions(): ClientProvider | Promise<ClientProvider> {
    const redisConfig = this.configService.get('redis', { infer: true });
    return {
      transport: Transport.REDIS, // Redis로 설정
      options: {
        host: redisConfig.pubHost,
        port: redisConfig.pubPort,
        password: redisConfig.pubToken,
        tls: {}, // TLS 옵션이 필요하지 않으면 생략 가능
      },
    } as RedisOptions;
  }
}
