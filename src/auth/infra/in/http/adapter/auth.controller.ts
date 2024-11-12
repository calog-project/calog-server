import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../common/config/config.type';
import {
  Get,
  Post,
  Body,
  Controller,
  Inject,
  UseGuards,
  UseInterceptors,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { SetTokenInterceptor } from 'src/common/interceptor/set-token.interceptor';
import { Cookies } from 'src/common/decorator/cookies.decorator';
import { UserId } from 'src/common/decorator/user-id.decorator';

import { LoginDto, SocialAuthRequest } from '../dto/auth.req';
import { LoginResDto, RefreshResDto } from '../dto/auth.res';

import {
  AuthUseCaseSymbol,
  AuthUseCase,
} from 'src/auth/domain/port/in/auth.usecase';
import {
  OAuthUseCaseSymbol,
  OAuthUseCase,
} from 'src/auth/domain/port/in/oauth.usecase';
import { RedirectDto } from '../../../../../common/dto/redirect.dto';
import { KakaoAuthGuard } from '../../guard/kakao-auth.guard';
import { GoogleAuthGuard } from '../../guard/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthUseCaseSymbol) private readonly _authUseCase: AuthUseCase,
    @Inject(OAuthUseCaseSymbol)
    private readonly _oauthUseCase: OAuthUseCase,
    private readonly _configService: ConfigService<AllConfigType>,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetTokenInterceptor)
  async login(@Body() dto: LoginDto): Promise<LoginResDto> {
    const { user, token } = await this._authUseCase.login(dto);
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
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(SetTokenInterceptor)
  async googleLoginCallback(
    @Req() req: Request & SocialAuthRequest,
  ): Promise<RedirectDto<LoginResDto>> {
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      req.user.email,
      req.user.provider,
    );
    const clientUrl = this._configService.get('app.clientUrl', { infer: true });
    const redirectUrl = `${clientUrl}/?oauth=${req.user.provider}`;
    return { url: redirectUrl, ...LoginResDto.of(user, token) };
  }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // @UseInterceptors(SetTokenInterceptor)
  // @Redirect(`${process.env.APP_CLIENT_URL}/`)
  // async googleLoginCallback(
  //   @Req() req: Request & SocialAuthRequest,
  // ): Promise<any> {
  //   const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
  //     req.user.email,
  //     req.user.provider,
  //   );
  //   return LoginResDto.of(user, token);
  // }

  @Get('kakao')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(KakaoAuthGuard)
  @UseInterceptors(SetTokenInterceptor)
  async kakaoLogin(
    @Req() req: Request & SocialAuthRequest,
  ): Promise<RedirectDto<LoginResDto>> {
    const { user, token } = await this._oauthUseCase.socialLoginOrSignup(
      req.user.email,
      req.user.provider,
    );
    const clientUrl = this._configService.get('app.clientUrl', { infer: true });
    const redirectUrl = `${clientUrl}/?oauth=${req.user.provider}`;
    return { url: redirectUrl, ...LoginResDto.of(user, token) };
  }

  @Get('test')
  async test() {}
}
