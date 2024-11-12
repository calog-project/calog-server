import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { SocialLoginDto } from '../http/dto/auth.req';

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
  ): Promise<SocialLoginDto> {
    const { _json, provider } = profile;
    const oauthUserInfo = _json.kakao_account;
    const email = oauthUserInfo.email;
    if (!oauthUserInfo.has_email || !email || !provider) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    return { email, provider };
  }
}
