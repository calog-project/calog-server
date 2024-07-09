import {
  Req,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from '../dto/auth.input';

import {
  AuthUseCaseSymbol,
  AuthUseCase,
} from 'src/auth/domain/port/in/auth.usecase';
import {
  GoogleAuthUseCaseSymbol,
  GoogleAuthUseCase,
} from 'src/auth/domain/port/in/google-auth.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthUseCaseSymbol) private readonly _authUseCase: AuthUseCase,
    @Inject(GoogleAuthUseCaseSymbol)
    private readonly _googleAuthUseCase: GoogleAuthUseCase,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto): Promise<any> {
    const token = await this._authUseCase.login({ email, password });
    return token;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request): Promise<void> {
    console.log('Successfully redirected');
    console.log(req.user);
    // await this._googleAuthUseCase
    // return req;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(): Promise<void> {}

  @Get('test')
  async test() {}
}
