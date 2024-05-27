import { registerAs } from '@nestjs/config';

export type DatabaseConfig = {
  url?: string; //mongoDB
  type: string; //RDB type
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
};

export default registerAs<DatabaseConfig>('db', () => {
  return {
    type: process.env.RDB_TYPE,
    host: process.env.RDB_HOST,
    port: process.env.RDB_PORT ? parseInt(process.env.RDB_PORT) : 3306,
    username: process.env.RDB_USERNAME,
    password: process.env.RDB_PASSWORD,
    name: process.env.RDB_DBNAME,
    synchronize: process.env.RDB_SYNCHRONIZE === 'true',
  };
});
