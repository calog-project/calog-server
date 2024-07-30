import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { AllConfigType } from '../config.type';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private _configService: ConfigService<AllConfigType>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this._configService.get('auth.jwtAccessSecret', { infer: true }),
      signOptions: {
        expiresIn: this._configService.get('auth.jwtAccessExpirationTime', {
          infer: true,
        }),
      },
    } as JwtModuleOptions;
  }
}
