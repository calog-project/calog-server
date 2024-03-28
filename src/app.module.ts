import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type:'single',
      url: `redis://default:${process.env.REDIS_TOKEN}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    }),
    AuthModule, 
    UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

