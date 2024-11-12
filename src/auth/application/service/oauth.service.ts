import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../common/config/config.type';

import { User } from 'src/user/domain/model/user';
import { Token } from 'src/auth/domain/token';

import { OAuthUseCase } from '../../domain/port/in/oauth.usecase';

import { JwtPort, JwtPortSymbol } from '../../domain/port/out/jwt.port';
import {
  CachePort,
  CachePortSymbol,
} from '../../../cache/domain/port/out/cache.port';
import {
  LoadUserPort,
  LoadUserPortSymbol,
} from '../../../user/domain/port/out/load-user.port';
import {
  HandleUserPort,
  HandleUserPortSymbol,
} from '../../../user/domain/port/out/handle-user.port';

@Injectable()
export class OAuthService implements OAuthUseCase {
  constructor(
    @Inject(JwtPortSymbol) private _jwtPort: JwtPort,
    @Inject(CachePortSymbol) private _cachePort: CachePort,
    @Inject(LoadUserPortSymbol) private _loadUserPort: LoadUserPort,
    @Inject(HandleUserPortSymbol) private _handleUserPort: HandleUserPort,
    private _configService: ConfigService<AllConfigType>,
  ) {}
  async socialLoginOrSignup(email: string, provider: string): Promise<any> {
    const user = await this._loadUserPort.findByEmail(email);
    let userId: string | number;
    let userModel: User;
    if (!user) {
      userModel = User.create({ email, provider });
      userId = await this._handleUserPort.save(userModel);
    } else {
      userId = user.props.id;
      userModel = user;
    }
    //토큰 생성
    const token = Token.create(
      this._jwtPort.generateAccessToken({ id: userId }),
      this._jwtPort.generateRefreshToken({ id: userId }),
    );

    const refreshExp = this._configService.get(
      'auth.jwtRefreshExpirationTime',
      { infer: true },
    );

    //캐시에 토큰 저장
    await this._cachePort.set(
      String(userId),
      token.provideToken().refreshToken,
      refreshExp,
    );
    return { user: userModel, token };
  }
}
