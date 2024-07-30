import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'src/cache/cache.module';

import { AuthController } from './infra/in/http/adapter/auth.controller';
import { JwtAccessStrategy } from './infra/in/strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './infra/in/strategy/jwt-refresh.strategy';
import { GoogleStrategy } from './infra/in/strategy/google-strategy';
import { KakaoStrategy } from './infra/in/strategy/kakao-strategy';
import { AuthService } from './application/service/auth.service';
import { EncryptAdapter } from './infra/out/encrypt/adapter/encrypt.adapter';
import { JwtAdapter } from './infra/out/jwt/adapter/jwt.adapter';

import { AuthUseCaseSymbol } from './domain/port/in/auth.usecase';
import { GoogleAuthUseCaseSymbol } from './domain/port/in/google-auth.usecase';
import { KakaoAuthUseCaseSymbol } from './domain/port/in/kakao-auth.usecase';

import { EncryptPortSymbol } from './domain/port/out/encrypt.port';
import { JwtPortSymbol } from './domain/port/out/jwt.port';

@Module({
  imports: [forwardRef(() => UserModule), CacheModule],
  controllers: [AuthController],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    KakaoStrategy,
    {
      provide: EncryptPortSymbol,
      useClass: EncryptAdapter,
    },
    {
      provide: JwtPortSymbol,
      useClass: JwtAdapter,
    },
    {
      provide: AuthUseCaseSymbol,
      useClass: AuthService,
    },
    {
      provide: GoogleAuthUseCaseSymbol,
      useClass: AuthService,
    },
    {
      provide: KakaoAuthUseCaseSymbol,
      useClass: AuthService,
    },
  ],
  exports: [
    EncryptPortSymbol,
    JwtPortSymbol,
    AuthUseCaseSymbol,
    GoogleAuthUseCaseSymbol,
    KakaoAuthUseCaseSymbol,
  ],
})
export class AuthModule {}
