import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/user.input';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<object> {
    const result = await this.userService.createUser(signupDto);
    return result;
  }
}
