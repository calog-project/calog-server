import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'src/cache/cache.module';

import { AuthController } from './infra/in/http/adapter/auth.controller';
import { AuthService } from './application/service/auth.service';
import { GoogleStrategy } from './infra/in/strategy/google-strategy';
import { JwtAdapter } from './infra/out/jwt/adapter/jwt.adapter';

import { AuthUseCaseSymbol } from './domain/port/in/auth.usecase';
import { GoogleAuthUseCaseSymbol } from './domain/port/in/google-auth.usecase';

import { JwtPortSymbol } from './domain/port/out/jwt.port';

@Module({
  imports: [UserModule, CacheModule],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
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
  ],
  exports: [JwtPortSymbol, AuthUseCaseSymbol, GoogleAuthUseCaseSymbol],
})
export class AuthModule {}
