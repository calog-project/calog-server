import { Injectable } from '@nestjs/common';
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
    done: VerifyCallback,
  ): Promise<void> {
    const { emails, provider } = profile;
    const socialLoginUser = {
      email: emails[0],
      provider: provider,
      externalId: profile.id,
      accessToken,
      refreshToken,
    };
    const socialLoginDto: SocialLoginDto = { email: emails[0].value, provider };
    console.log(socialLoginUser);
    try {
      done(null, socialLoginDto, { accessToken: accessToken });
    } catch (err) {
      done(err, false);
    }
  }
}
