import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { FollowEntity } from './entity/follow.entity';
import { UserRepositoryAdapter } from './adapter/user-repository.adapter';
import { TestUserInitializeService } from './test-user-initialize.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  providers: [TestUserInitializeService, UserRepositoryAdapter],
  exports: [UserRepositoryAdapter],
})
export class UserPersistenceModule {}
