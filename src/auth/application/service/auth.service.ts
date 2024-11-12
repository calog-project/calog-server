import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../common/config/config.type';

import { User } from 'src/user/domain/model/user';
import { Token } from 'src/auth/domain/token';
import { LoginDto } from '../../infra/in/http/dto/auth.req';

import { AuthUseCase } from 'src/auth/domain/port/in/auth.usecase';

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
export class AuthService implements AuthUseCase {
  constructor(
    @Inject(JwtPortSymbol)
    private _jwtPort: JwtPort,
    @Inject(EncryptPortSymbol)
    private _encryptPort: EncryptPort,
    @Inject(CachePortSymbol)
    private _cachePort: CachePort,
    @Inject(LoadUserPortSymbol)
    private _loadUserPort: LoadUserPort,
    private _configService: ConfigService<AllConfigType>,
  ) {}

  async login(dto: LoginDto): Promise<{ user: User; token: Token }> {
    const user = await this._loadUserPort.findByEmail(dto.email);
    if (!user) throw new NotFoundException();
    const isValid = await this._encryptPort.comparePassword(
      dto.password,
      user.props.password,
    );
    if (!isValid) throw new UnauthorizedException('인증 실패');

    const token = Token.create(
      this._jwtPort.generateAccessToken({ id: user.props.id }),
      this._jwtPort.generateRefreshToken({ id: user.props.id }),
    );
    const refreshExp = this._configService.get(
      'auth.jwtRefreshExpirationTime',
      { infer: true },
    );
    // const hashedRefreshToken = await this._encryptPort.encryptPassword(refresh);

    await this._cachePort.set(
      String(user.props.id),
      token.provideToken().refreshToken,
      refreshExp,
    );

    return { user, token };
  }
  async logout(): Promise<any> {}
  async validate(): Promise<any> {
    // const user = await this._loadUserPort.findByEmail(email);
    // if (!user) {}
    //     throw new UnauthorizedException('가입된 유저가 아닙니다.');
    // }
    // if (user && (await this._encryptPort(password, user.password))) {
    //     delete user.pw;
    //     return user;
    // } else {
    //     throw new BadRequestException('패스워드를 확인해주세요');
    // }
  }

  async refresh(userId: number): Promise<Token> {
    const token = Token.create(
      this._jwtPort.generateAccessToken({ id: userId }),
      this._jwtPort.generateRefreshToken({ id: userId }),
    );
    const refreshExp = this._configService.get(
      'auth.jwtRefreshExpirationTime',
      { infer: true },
    );

    await this._cachePort.set(
      String(userId),
      token.provideToken().refreshToken,
      refreshExp,
    );
    return token;
  }

  async compareRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<boolean> {
    const currentToken = await this._cachePort.get(userId);
    return !!(currentToken === refreshToken);
  }
}
