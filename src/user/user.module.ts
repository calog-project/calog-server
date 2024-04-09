import { Module } from '@nestjs/common';
import { UserController } from './application/user.controller';
import { UserPersistenceModule } from './infra/user-persistence.module';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
