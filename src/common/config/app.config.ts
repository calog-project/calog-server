import { registerAs } from '@nestjs/config';

export type AppConfig = {
  nodeEnv: string;
  url: string;
  port: number;
  apiPrefix: string;
};

export default registerAs<AppConfig>('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    url: process.env.APP_SERVER_URL,
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
