import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

import { ConfigOptions } from './config-options';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RedisConfigService } from './cache/redis-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions.createConfigOptions()),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
  ],
})
export class InfraSetupModule {}
