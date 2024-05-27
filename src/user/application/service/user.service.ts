import { Injectable, NotFoundException } from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/user';

//Dto
import { CreateUserDto } from '../dto/user.input';

//Input port
import { CreateUserUseCase } from '../../domain/port/in/create-user.usecase';
import { GetUserUseCase } from '../../domain/port/in/get-user.usecase';

//Output port
import { CreateUserPort } from 'src/user/domain/port/out/create-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements CreateUserUseCase, GetUserUseCase {
  constructor(
    private _createUserPort: CreateUserPort,
    private _getUserPort: LoadUserPort,
  ) {}

  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    //   const isExists = await this.getUserByEmailUseCase.getUserByEmail();
    //   //if(getUserByEmail) throw new HttpException
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await this._createUserPort.save(user);
    return result;
  }

  async getUserById(id: number): Promise<Nullable<User>> {
    const user = await this._getUserPort.findById(id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async getUserByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._getUserPort.findByEmail(email);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async isExistsEmail(email: string): Promise<boolean> {
    const user = await this._getUserPort.findByEmail(email);
    return !!user;
  }
}
