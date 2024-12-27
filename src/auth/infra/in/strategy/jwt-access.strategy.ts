import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AllConfigType } from 'src/common/config/config.type';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('auth.jwtAccessSecret', { infer: true }),
    });
  }

  async validate(payload: any): Promise<number> {
    return parseInt(payload.id, 10);
  }
}
