import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryAdapter } from './persistence/adapter/user-repository.adapter';
import { UserEntity } from './persistence/entity/user.entity';
import { UserService } from '../application/service/user.service';

import { CreateUseCaseSymbol } from '../domain/usecase/create-user.usecase';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserRepositoryAdapter,
    {
      provide: CreateUseCaseSymbol,
      useFactory: (userRepositoryAdapter) =>
        new UserService(userRepositoryAdapter), // service에서 사용하는 usecase의 수만큼 의존성 주입해줘야함 (service에 생성자 인수 갯수)
      inject: [UserRepositoryAdapter],
    },
  ],
  exports: [CreateUseCaseSymbol],
})
export class UserPersistenceModule {}
