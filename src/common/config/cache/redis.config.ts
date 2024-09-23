import { registerAs } from '@nestjs/config';

export type RedisConfig = {
  cacheToken: string;
  cacheHost: string;
  cachePort: number;
  pubToken: string;
  pubHost: string;
  pubPort: number;
};

export default registerAs<RedisConfig>('redis', () => {
  return {
    cacheToken: process.env.REDIS_CACHE_TOKEN,
    cacheHost: process.env.REDIS_CACHE_HOST,
    cachePort: parseInt(process.env.REDIS_CACHE_PORT),
    pubToken: process.env.REDIS_PUB_TOKEN,
    pubHost: process.env.REDIS_PUB_HOST,
    pubPort: parseInt(process.env.REDIS_PUB_PORT),
  };
});
