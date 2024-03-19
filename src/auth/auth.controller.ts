import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/auth.input';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: loginDto): Promise<object> {
    const result = await this.authService.login({ email, password });
    return result;
  }
}
