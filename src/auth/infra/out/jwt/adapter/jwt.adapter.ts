import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPort } from 'src/auth/domain/port/out/jwt.port';
import { AllConfigType } from 'src/common/config/config.type';

@Injectable()
export class JwtAdapter implements JwtPort {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  generateAccessToken(payload: object, options?: any): string {
    return this._jwtService.sign(payload, options);
  }

  generateRefreshToken(payload: object, options?: any): string {
    const refreshSecret = this._configService.get('auth.jwtRefreshSecret', {
      infer: true,
    });
    const refreshExpiration = this._configService.get(
      'auth.jwtRefreshExpirationTime',
      { infer: true },
    );
    return this._jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiration,
    });
  }

  verify(token: string, options?: object) {
    return this._jwtService.verify(token, options);
  }
}
