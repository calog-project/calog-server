import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';
import { UserMapper } from '../mapper/user.mapper';

import { User } from 'src/user/domain/model/user';
import { CreateUserDto } from '../dto/user.req';

import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from 'src/user/domain/port/in/create-user.usecase';
import {
  GetUserUseCaseSymbol,
  GetUserUseCase,
} from 'src/user/domain/port/in/get-user.usecase';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CreateUserUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<void> {
    await this._createUserUseCase.createUser(UserMapper.toDomain(dto));
    return;
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Nullable<User>> {
    const user = await this._getUserUseCase.getUserById(id);
    return user;
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ exists: boolean }> {
    const result = await this._getUserUseCase.isExistsEmail(email);
    return { exists: result };
  }
}
