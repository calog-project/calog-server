import { AppConfig } from './app.config';
import { AuthConfig } from './auth/auth.config';
import { RedisConfig } from './cache/redis.config';
import { DatabaseConfig } from './database/database.config';

export type AllConfigType = {
  app: AppConfig;
  db: DatabaseConfig;
  redis: RedisConfig;
  auth: AuthConfig;
};
