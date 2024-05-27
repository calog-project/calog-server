import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './persistence/entity/user.entity';
import { UserRepositoryAdapter } from './persistence/adapter/user-repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserRepositoryAdapter,
    // {
    //   provide: CreateUserUseCaseSymbol,
    //   useFactory: (userRepositoryAdapter) =>
    //     new UserService(userRepositoryAdapter, userRepositoryAdapter), // service에서 사용하는 usecase의 수만큼 의존성 주입해야함 (service에 생성자 인수 갯수)
    //   inject: [UserRepositoryAdapter],
    // },
    // {
    //   provide: GetUserUseCaseSymbol,
    //   useFactory: (userRepositoryAdapter) =>
    //     new UserService(userRepositoryAdapter, userRepositoryAdapter),
    //   inject: [UserRepositoryAdapter],
    // },
  ],
  // exports: [CreateUserUseCaseSymbol, GetUserUseCaseSymbol],
  exports: [UserRepositoryAdapter],
})
export class UserPersistenceModule {}
