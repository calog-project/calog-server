import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Optional } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/user';

import { AuthUseCase } from 'src/auth/domain/port/in/auth.usecase';
import { GoogleAuthUseCase } from 'src/auth/domain/port/in/google-auth.usecase';

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
export class AuthService implements AuthUseCase, GoogleAuthUseCase {
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

  async login(userInfo: Pick<User, 'email' | 'password'>): Promise<object> {
    const user = await this._loadUserPort.findByEmail(userInfo.email);
    if (!user) throw new NotFoundException();

    const isValidated = await this._encryptPort.comparePassword(
      userInfo.password,
      user.password,
    );
    if (!isValidated) throw new UnauthorizedException();

    const accessToken = this._jwtPort.generateAccessToken({ id: user.id });
    const refreshToken = this._jwtPort.generateRefreshToken({ id: user.id });

    const refreshExpiration = this._configService.get(
      'auth.jwtRefreshExpirationTime',
    );
    await this._cachePort.set(
      user.id.toString(),
      refreshToken,
      refreshExpiration,
    );

    const token = await this._cachePort.get(user.id.toString());
    return { accessToken, refreshToken };
  }

  async validate(): Promise<any> {}

  async refresh(): Promise<any> {}
}
