import { registerAs } from '@nestjs/config';

export type RedisConfig = {
  token: string;
  host: string;
  port: number;
};

export default registerAs<RedisConfig>('redis', () => {
  return {
    token: process.env.REDIS_TOKEN,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  };
});
