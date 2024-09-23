import {
  Get,
  Post,
  Body,
  Controller,
  Inject,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { SetTokenInterceptor } from 'src/common/interceptor/set-token.interceptor';
import { Cookies } from 'src/common/decorator/cookies.decorator';
import { UserId } from 'src/common/decorator/user-id.decorator';

import { LoginDto, SocialLoginDto } from '../dto/auth.req';
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
  async googleLoginCallback(@Req() req: Request): Promise<any> {
    const { email, provider } = req.user as SocialLoginDto;
    console.log(req.user);
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      email,
      provider,
    );
    return LoginResDto.of(user, token);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @UseInterceptors(SetTokenInterceptor)
  async kakaoLogin(@Req() req: Request): Promise<any> {
    const { email, provider } = req.user as SocialLoginDto;
    console.log(req.user);
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      email,
      provider,
    );
    return LoginResDto.of(user, token);
  }

  @Get('test')
  async test() {}
}
