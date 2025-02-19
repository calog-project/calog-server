import { Module, forwardRef } from '@nestjs/common';
import { UserPersistenceModule } from './infra/out/persistence/user-persistence.module';

import { UserController } from './infra/in/http/adapter/user.controller';
import { UserService } from './application/service/user.service';
import { UserRepositoryAdapter } from './infra/out/persistence/adapter/user-repository.adapter';
import { S3FileAdapter } from './infra/out/file/adapter/s3-file.adapter';

import {
  ApproveFollowHandler,
  CreateUserHandler,
  PostFollowHandler,
  RejectFollowHandler,
  UnfollowHandler,
} from './application/command/user.command-handler';
import { GetUserQuery } from './application/query/user.query';
import { GetUsersHandler } from './application/query/user.query-handler';

import { CreateUserUseCaseSymbol } from './domain/port/in/create-user.usecase';
import { GetUserUseCaseSymbol } from './domain/port/in/get-user.usecase';
import { UpdateUserUseCaseSymbol } from './domain/port/in/update-user.usecase';
import { FollowUseCaseSymbol } from './domain/port/in/follow.usecase';

import { HandleUserPortSymbol } from './domain/port/out/handle-user.port';
import { LoadUserPortSymbol } from './domain/port/out/load-user.port';
import { FilePortSymbol } from './domain/port/out/file.port';
import { AuthModule } from '../auth/auth.module';

const adapterProviders = [
  {
    provide: FilePortSymbol,
    useClass: S3FileAdapter,
  },
  {
    provide: HandleUserPortSymbol,
    useExisting: UserRepositoryAdapter, //두개의 포트가 같은 인스턴스를 공유함.
  },
  {
    provide: LoadUserPortSymbol,
    useExisting: UserRepositoryAdapter, //하나의 usecase에서 두 포트를 모두 사용할 경우도 있기때문에 useExisting을 사용
  },
];

const useCaseProviders = [
  {
    provide: CreateUserUseCaseSymbol,
    useClass: UserService,
  },
  {
    provide: GetUserUseCaseSymbol,
    useClass: UserService,
  },
  {
    provide: UpdateUserUseCaseSymbol,
    useClass: UserService,
  },
  {
    provide: FollowUseCaseSymbol,
    useClass: UserService,
  },
];

const CommandQueryHandlerProviders = [
  CreateUserHandler,
  GetUserQuery,
  GetUsersHandler,
  PostFollowHandler,
  UnfollowHandler,
  ApproveFollowHandler,
  RejectFollowHandler,
];

@Module({
  imports: [UserPersistenceModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    ...adapterProviders,
    ...useCaseProviders,
    ...CommandQueryHandlerProviders,
  ],
  exports: [
    CreateUserUseCaseSymbol,
    GetUserUseCaseSymbol,
    HandleUserPortSymbol,
    LoadUserPortSymbol,
  ],
})
export class UserModule {}
