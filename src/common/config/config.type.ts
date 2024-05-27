import { AppConfig } from './app.config';
import { DatabaseConfig } from './database/database.config';

export type AllConfigType = {
  app: AppConfig;
  db: DatabaseConfig;
};
