import { Module, forwardRef } from '@nestjs/common';
import { UserPersistenceModule } from './infra/out/persistence/user-persistence.module';

import { UserController } from './infra/in/http/adapter/user.controller';
import { UserService } from './application/service/user.service';
import { UserRepositoryAdapter } from './infra/out/persistence/adapter/user-repository.adapter';

import { CreateUserUseCaseSymbol } from './domain/port/in/create-user.usecase';
import { GetUserUseCaseSymbol } from './domain/port/in/get-user.usecase';

import { HandleUserPortSymbol } from './domain/port/out/handle-user.port';
import { LoadUserPortSymbol } from './domain/port/out/load-user.port';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserPersistenceModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    // 문자열 또는 simbol에 클래스를 바인딩함. 이로인해 service 또는 controller에서 해당 심볼 -> @Inject() 내부에 넣으면 의존성 주입. 해당 의존성의 타입(포트)에 따라 해당 포트의 구현하는 기능이 달라짐(인터페이스를 의존)
    {
      provide: HandleUserPortSymbol,
      useExisting: UserRepositoryAdapter, //두개의 포트가 같은 인스턴스를 공유함.
    },
    {
      provide: LoadUserPortSymbol,
      useExisting: UserRepositoryAdapter, //하나의 usecase에서 두 포트를 모두 사용할 경우도 있기때문에 useExisting을 사용
    },
    {
      provide: CreateUserUseCaseSymbol,
      useClass: UserService,
    },
    {
      provide: GetUserUseCaseSymbol,
      useClass: UserService,
    },
  ],
  exports: [
    CreateUserUseCaseSymbol,
    GetUserUseCaseSymbol,
    HandleUserPortSymbol,
    LoadUserPortSymbol,
  ],
})
export class UserModule {}
