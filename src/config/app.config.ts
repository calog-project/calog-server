import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';

export default registerAs<AppConfig>('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
