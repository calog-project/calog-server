import { registerAs } from '@nestjs/config';

export type AppConfig = {
  nodeEnv: string;
  clientUrl: string;
  url: string;
  port: number;
  apiPrefix: string;
  origin: string;
};

export default registerAs<AppConfig>('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    url: process.env.APP_SERVER_URL,
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000,
    apiPrefix: process.env.API_PREFIX || 'api',
    origin: process.env.ORIGIN,
    clientUrl: process.env.APP_CLIENT_URL,
  };
});
