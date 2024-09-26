import {
  Get,
  Post,
  Body,
  Controller,
  Inject,
  UseGuards,
  UseInterceptors,
  Req,
  Redirect,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { SetTokenInterceptor } from 'src/common/interceptor/set-token.interceptor';
import { Cookies } from 'src/common/decorator/cookies.decorator';
import { UserId } from 'src/common/decorator/user-id.decorator';

import { LoginDto, SocialAuthRequest } from '../dto/auth.req';
import { LoginResDto, RefreshResDto } from '../dto/auth.res';
import { UserMapper } from 'src/user/infra/in/http/mapper/user.mapper';

import {
  AuthUseCaseSymbol,
  AuthUseCase,
} from 'src/auth/domain/port/in/auth.usecase';
import {
  OAuthUseCaseSymbol,
  OAuthUseCase,
} from 'src/auth/domain/port/in/oauth.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthUseCaseSymbol) private readonly _authUseCase: AuthUseCase,
    @Inject(OAuthUseCaseSymbol)
    private readonly _oauthUseCase: OAuthUseCase,
  ) {}

  @Post('login')
  @UseInterceptors(SetTokenInterceptor)
  async login(@Body() dto: LoginDto): Promise<LoginResDto> {
    const { user, token } = await this._authUseCase.login(
      UserMapper.toDomain(dto),
    );
    return LoginResDto.of(user, token);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @UseInterceptors(SetTokenInterceptor)
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @UserId() userId: number,
  ): Promise<RefreshResDto> {
    const token = await this._authUseCase.refresh(userId);
    return { userId, token };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(SetTokenInterceptor)
  @Redirect(`${process.env.APP_CLIENT_URL}/`)
  async googleLoginCallback(
    @Req() req: Request & SocialAuthRequest,
  ): Promise<any> {
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      req.user.email,
      req.user.provider,
    );
    return LoginResDto.of(user, token);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @UseInterceptors(SetTokenInterceptor)
  @Redirect(`${process.env.APP_CLIENT_URL}/`)
  async kakaoLogin(@Req() req: Request & SocialAuthRequest): Promise<any> {
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      req.user.email,
      req.user.provider,
    );
    return LoginResDto.of(user, token);
  }

  @Get('test')
  async test() {}
}
