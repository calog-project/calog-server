import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SetTokenInterceptor } from './common/interceptor/set-token.interceptor';

import { InfraSetupModule } from './common/config/infra-setup.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { ScheduleModule } from './schedule/schedule.module';
/**
 * @TODO
 * refactor - DB의 세부사항(ex, typeorm, mongo)의 변경에 의해 usecase가 바뀌면 안됨.
 * solution - repository 추상화
 */
@Module({
  imports: [
    InfraSetupModule,
    CacheModule,
    UserModule,
    AuthModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SetTokenInterceptor,
    },
  ],
})
export class AppModule {}
