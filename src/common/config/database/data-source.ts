import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

const env = process.env.NODE_ENV == 'development' ? '.dev' : '';
const envFilePath = path.resolve(process.cwd(), `.env${env}`);
dotenv.config({ path: envFilePath });

const databaseConfig: DataSourceOptions = {
  type: process.env.RDB_TYPE as 'mysql',
  host: process.env.RDB_HOST,
  port: parseInt(process.env.RDB_PORT || '3306', 10),
  username: process.env.RDB_USERNAME,
  password: process.env.RDB_PASSWORD,
  database: process.env.RDB_DBNAME,
  synchronize: process.env.RDB_SYNCHRONIZE === 'true',
  dropSchema: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
  migrations: [
    __dirname + '/../../../common/config/database/migrations/**/*{.ts,.js}',
  ],
  namingStrategy: new SnakeNamingStrategy(),
  timezone: '+00:00',
};

export const AppDataSource = new DataSource(databaseConfig);
