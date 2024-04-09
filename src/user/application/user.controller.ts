import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.input';
import {
  CreateUseCaseSymbol,
  CreateUserUseCase,
} from '../domain/usecase/create-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CreateUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<object> {
    const result = await this._createUserUseCase.createUser(createUserDto);
    return result;
  }
}
