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
    const accessSecret = this._configService.get('auth.jwtAccessSecret', {
      infer: true,
    });
    const accessExpiration = this._configService.get(
      'auth.jwtAccessExpirationTime',
      { infer: true },
    );
    const accessToken = this._jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiration,
      // subject: 'access',
    });
    return accessToken;
  }

  generateRefreshToken(payload: object, options?: any): string {
    const refreshSecret = this._configService.get('auth.jwtRefreshSecret', {
      infer: true,
    });
    const refreshExpiration = this._configService.get(
      'auth.jwtRefreshExpirationTime',
      { infer: true },
    );

    const refreshToken = this._jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiration,
      // subject: 'refresh',
    });
    return refreshToken;
  }

  verify(token: string, options?: object) {
    return this._jwtService.verify(token, options);
  }
}
