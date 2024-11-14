import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AllConfigType } from 'src/common/config/config.type';
import { SocialLoginDto } from '../http/dto/auth.req';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly _configService: ConfigService<AllConfigType>) {
    super({
      clientID: _configService.get('auth.googleClientId', { infer: true }),
      clientSecret: _configService.get('auth.googleClientSecret', {
        infer: true,
      }),
      callbackURL: _configService.get('auth.googleCallbackUrl', {
        infer: true,
      }),
      scope: _configService.get('auth.googleScope', { infer: true }),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<SocialLoginDto> {
    const { emails, provider } = profile;
    const socialLoginUser = {
      email: emails[0],
      provider: provider,
      externalId: profile.id,
      accessToken,
      refreshToken,
    };

    if (!emails[0] || !emails[0].verified || !provider) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    return { email: emails[0].value, provider };
  }
}
