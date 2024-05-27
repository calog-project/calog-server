import { Module } from '@nestjs/common';

import { InfraSetupModule } from './common/config/infra-setup.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

/**
 * @TODO
 * refactor - DB의 세부사항(ex, typeorm, mongo)의 변경에 의해 usecase가 바뀌면 안됨.
 * solution - repository 추상화
 */
@Module({
  imports: [InfraSetupModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
