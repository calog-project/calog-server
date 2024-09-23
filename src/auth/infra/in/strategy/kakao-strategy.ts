import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

import { AllConfigType } from 'src/common/config/config.type';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly _configService: ConfigService<AllConfigType>) {
    super({
      clientID: _configService.get('auth.kakaoClientId', { infer: true }),
      clientSecret: '',
      callbackURL: _configService.get('auth.kakaoCallbackUrl', { infer: true }),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const socialLoginUser = {
        accessToken,
        refreshToken,
        info: _json,
      };
      done(null, socialLoginUser, { accessToken: accessToken });
    } catch (error) {
      done(error);
    }
  }
}
