import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';
import { UserMapper } from './mapper/user.mapper';
import { User } from '../domain/user';
import { CreateUserDto } from './dto/user.input';

import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from '../domain/usecase/create-user.usecase';
import {
  GetUserUseCaseSymbol,
  GetUserUseCase,
} from '../domain/usecase/get-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CreateUserUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}
  @Get('testError')
  async test() {
    return;
  }
  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<number | string> {
    const result = await this._createUserUseCase.createUser(
      UserMapper.toDomain(dto),
    );
    return result;
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Nullable<User>> {
    console.log(GetUserUseCaseSymbol);
    console.log(this._getUserUseCase);
    const user = await this._getUserUseCase.getUser(id);
    return user;
  }
}
