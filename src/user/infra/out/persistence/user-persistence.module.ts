import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepositoryAdapter } from './adapter/user-repository.adapter';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepositoryAdapter],
  // exports: [HandleUserPort, LoadUserPort],
  exports: [UserRepositoryAdapter],
})
export class UserPersistenceModule {}
