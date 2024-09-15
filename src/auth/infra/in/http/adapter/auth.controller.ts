import {
  Get,
  Post,
  Body,
  Controller,
  Inject,
  UseGuards,
  UseInterceptors,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { SetTokenInterceptor } from 'src/common/interceptor/set-token.interceptor';
import { Cookies } from 'src/common/decorator/cookies.decorator';
import { UserId } from 'src/common/decorator/user-id.decorator';

import { LoginDto } from '../dto/auth.req';
import { LoginResDto, RefreshResDto } from '../dto/auth.res';

import {
  AuthUseCaseSymbol,
  AuthUseCase,
} from 'src/auth/domain/port/in/auth.usecase';
import {
  GoogleAuthUseCaseSymbol,
  GoogleAuthUseCase,
} from 'src/auth/domain/port/in/google-auth.usecase';
import {
  KakaoAuthUseCase,
  KakaoAuthUseCaseSymbol,
} from 'src/auth/domain/port/in/kakao-auth.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthUseCaseSymbol) private readonly _authUseCase: AuthUseCase,
    @Inject(GoogleAuthUseCaseSymbol)
    private readonly _googleAuthUseCase: GoogleAuthUseCase,
    @Inject(KakaoAuthUseCaseSymbol)
    private readonly _kakaoAuthUseCase: KakaoAuthUseCase,
  ) {}

  @Post('login')
  @UseInterceptors(SetTokenInterceptor)
  async login(@Body() { email, password }: LoginDto): Promise<any> {
    const token = await this._authUseCase.login({ email, password });
    return token;
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @UseInterceptors(SetTokenInterceptor)
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @UserId() userId: number,
  ): Promise<RefreshResDto> {
    const token = await this._authUseCase.refresh(refreshToken, userId);
    return { userId, token };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request): Promise<void> {
    console.log('Success');
    console.log(req);
    await this._googleAuthUseCase.googleSocialLogin('email');
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Req() req: Request): Promise<void> {
    console.log('Success');
    console.log(req.user);
    // await this._kakaoAuthUseCase
  }

  @Get('test')
  async test() {}
}
