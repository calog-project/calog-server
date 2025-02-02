import {
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Controller,
  Inject,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';
import { UserMapper } from '../mapper/user.mapper';

import { CreateUserDto, UpdateUserDto } from '../dto/user.req';

import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from 'src/user/domain/port/in/create-user.usecase';
import {
  GetUserUseCaseSymbol,
  GetUserUseCase,
} from 'src/user/domain/port/in/get-user.usecase';
import {
  UpdateUserUseCase,
  UpdateUserUseCaseSymbol,
} from 'src/user/domain/port/in/update-user.usecase';
import { ShowUserResDto } from '../dto/user.res';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CreateUserUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
    @Inject(UpdateUserUseCaseSymbol)
    private readonly _updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<void> {
    await this._createUserUseCase.createUser(UserMapper.toDomain(dto));
    return;
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: number,
  ): Promise<Nullable<ShowUserResDto>> {
    const user = await this._getUserUseCase.getUserById(id);
    return UserMapper.toDto(user);
  }

  @Patch(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    await this._updateUserUseCase.updateUseCommand(
      UserMapper.toDomain({ ...dto, id }),
    );
    return;
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ isAvailable: boolean }> {
    const isExists = await this._getUserUseCase.isExistsEmail(email);
    const isAvailable = !isExists;
    return { isAvailable };
  }

  @Get('check-nickname/:nickname')
  async checkNickname(
    @Param('nickname') nickname: string,
  ): Promise<{ isAvailable: boolean }> {
    const isExists = await this._getUserUseCase.isExistsNickname(nickname);
    const isAvailable = !isExists;
    return { isAvailable };
  }

  @Post('follow/:id')
  async followingUser() {}

  @Get('follower')
  async getFollowers() {}

  @Patch('follow/:id/approve')
  async approveFollow() {}

  @Delete('follow/:id')
  async deleteFollow() {}
}
