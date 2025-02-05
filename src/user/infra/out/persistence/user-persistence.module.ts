import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserRepositoryAdapter } from './adapter/user-repository.adapter';
import { FollowEntity } from './entity/follow.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  providers: [UserRepositoryAdapter],
  exports: [UserRepositoryAdapter],
})
export class UserPersistenceModule {}
