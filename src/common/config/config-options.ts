//config
import { ConfigModuleOptions } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from 'src/common/config/database/database.config';
import redisConfig from './cache/redis.config';
import authConfig from './auth/auth.config';

export class ConfigOptions {
  static createConfigOptions(): ConfigModuleOptions {
    return {
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, authConfig],
      envFilePath:
        `${process.env.NODE_ENV}` === 'production' ? '.env' : '.env.dev',
    };
  }
}
