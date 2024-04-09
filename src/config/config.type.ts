import { AppConfig } from './app-config.type';
import { DatabaseConfig } from 'src/database/config/database-config.type';

export type AllConfigType = {
  app: AppConfig;
  db: DatabaseConfig;
};
