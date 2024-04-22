import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserMapper } from './mapper/user.mapper';
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
  async signup(@Body() dto: CreateUserDto): Promise<number | string> {
    const result = await this._createUserUseCase.createUser(
      UserMapper.toDomain(dto),
    );
    return result;
  }
}
