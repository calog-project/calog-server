import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Optional } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/user';
import { AuthUser } from 'src/auth/domain/authUser';
import { TokenPayload } from 'src/auth/domain/tokenPayload';

import { AuthUseCase } from 'src/auth/domain/port/in/auth.usecase';
import { GoogleAuthUseCase } from 'src/auth/domain/port/in/google-auth.usecase';
import { KakaoAuthUseCase } from 'src/auth/domain/port/in/kakao-auth.usecase';

import { JwtPortSymbol, JwtPort } from 'src/auth/domain/port/out/jwt.port';
import {
  EncryptPortSymbol,
  EncryptPort,
} from 'src/auth/domain/port/out/encrypt.port';
import {
  CachePortSymbol,
  CachePort,
} from 'src/cache/domain/port/out/cache.port';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from 'src/user/domain/port/out/load-user.port';

@Injectable()
export class AuthService
  implements AuthUseCase, GoogleAuthUseCase, KakaoAuthUseCase
{
  constructor(
    @Inject(JwtPortSymbol)
    private _jwtPort: JwtPort,
    @Inject(EncryptPortSymbol)
    private _encryptPort: EncryptPort,
    @Inject(CachePortSymbol)
    private _cachePort: CachePort,
    @Inject(LoadUserPortSymbol)
    private _loadUserPort: LoadUserPort,
    private _configService: ConfigService,
  ) {}

  async login(userInfo: Pick<User, 'email' | 'password'>): Promise<AuthUser> {
    const user = await this._loadUserPort.findByEmail(userInfo.email);
    if (!user) throw new NotFoundException();

    const isValid = await this._encryptPort.comparePassword(
      userInfo.password,
      user.password,
    );
    if (!isValid) throw new UnauthorizedException('인증 실패');

    const token: TokenPayload = {
      accessToken: this._jwtPort.generateAccessToken({ id: user.id }),
      refreshToken: this._jwtPort.generateRefreshToken({ id: user.id }),
    };
    const refreshExp = this._configService.get('auth.jwtRefreshExpirationTime');
    // const hashedRefreshToken = await this._encryptPort.encryptPassword(refresh);

    await this._cachePort.set(String(user.id), token.refreshToken, refreshExp);

    const authUser = AuthUser.create(user, token);
    return authUser;
  }
  //https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda/blob/main/backend/src/lib/bounded-contexts/iam/authentication/domain/user.entity.ts
  //https://github.com/SunhyeokChoe/nestjs-clean-architecture/blob/master/src/core/domain/user/entity/User.ts

  async validate(): Promise<any> {
    // const user = await this._loadUserPort.findByEmail(email);
    // if (!user) {
    //     throw new UnauthorizedException('가입된 유저가 아닙니다.');
    // }
    // if (user && (await this._encryptPort(password, user.password))) {
    //     delete user.pw;
    //     return user;
    // } else {
    //     throw new BadRequestException('패스워드를 확인해주세요');
    // }
  }

  async refresh(curRefresh: string, userId: number): Promise<any> {
    const accessToken = this._jwtPort.generateAccessToken({ id: userId });
    const refreshToken = this._jwtPort.generateRefreshToken({ id: userId });
    const refreshExp = this._configService.get('auth.jwtRefreshExpirationTime');

    await this._cachePort.set(String(userId), refreshToken, refreshExp);
    return { accessToken, refreshToken };
  }

  async compareRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<boolean> {
    const currentToken = await this._cachePort.get(userId);
    return currentToken === refreshToken ? true : false;
  }
}
