import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AllConfigType } from 'src/common/config/config.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.get('auth.googleClientId', { infer: true }),
      clientSecret: configService.get('auth.googleClientSecret', {
        infer: true,
      }),
      callbackURL: configService.get('auth.googleCallbackUrl', { infer: true }),
      scope: configService.get('auth.googleScope', { infer: true }),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { emails, provider } = profile;
    const socialLoginUser: object = {
      email: emails,
      provider: provider,
      externalId: profile.id,
      accessToken,
      refreshToken,
    };
    try {
      console.log(socialLoginUser);
      done(null, socialLoginUser, { accessToken: accessToken });
    } catch (err) {
      done(err, false);
    }
  }
}
