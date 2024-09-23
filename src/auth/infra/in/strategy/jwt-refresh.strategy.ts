import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AllConfigType } from 'src/common/config/config.type';

import {
  AuthUseCase,
  AuthUseCaseSymbol,
} from 'src/auth/domain/port/in/auth.usecase';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(AuthUseCaseSymbol)
    private readonly _authUseCase: AuthUseCase,
    private readonly _configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.refreshToken;
        },
      ]),
      secretOrKey: _configService.get('auth.jwtRefreshSecret', { infer: true }),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any): Promise<number> {
    const isMatched = await this._authUseCase.compareRefreshToken(
      req.cookies?.refreshToken,
      payload.id,
    );
    if (!isMatched) throw new UnauthorizedException('인증 실패');
    else return parseInt(payload.id, 10);
  }
}
