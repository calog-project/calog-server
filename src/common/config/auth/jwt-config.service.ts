import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { AllConfigType } from '../config.type';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.configService.get('auth.jwtAccessSecret', { infer: true }),
      signOptions: {
        expiresIn: this.configService.get('auth.jwtAccessExpirationTime', {
          infer: true,
        }),
      },
    } as JwtModuleOptions;
  }
}
