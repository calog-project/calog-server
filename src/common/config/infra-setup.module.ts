import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigOptions } from './config-options';
import { JwtConfigService } from './auth/jwt-config.service';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { CacheConfigService } from './cache/cache-config.service';
import { RedisConfigService } from './cache/redis-config.service';
import { AllConfigType } from './config.type';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions.createConfigOptions()),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
  ],
  exports: [JwtModule, CacheModule, RedisModule],
})
export class InfraSetupModule {}
