import { Module } from '@nestjs/common';
import { UserController } from './application/user.controller';
import { UserService } from './application/service/user.service';
import { UserRepositoryAdapter } from './infra/persistence/adapter/user-repository.adapter';
import { UserPersistenceModule } from './infra/user-persistence.module';

import { CreateUserUseCaseSymbol } from './domain/port/in/create-user.usecase';
import { GetUserUseCaseSymbol } from './domain/port/in/get-user.usecase';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCaseSymbol,
      useFactory: (userRepositoryAdapter) =>
        new UserService(userRepositoryAdapter, userRepositoryAdapter), // service에서 사용하는 usecase의 수만큼 의존성 주입해야함 (service에 생성자 인수 갯수)
      inject: [UserRepositoryAdapter],
    },
    {
      provide: GetUserUseCaseSymbol,
      useFactory: (userRepositoryAdapter) =>
        new UserService(userRepositoryAdapter, userRepositoryAdapter),
      inject: [UserRepositoryAdapter],
    },
  ],
  exports: [CreateUserUseCaseSymbol, GetUserUseCaseSymbol],
})
export class UserModule {}
