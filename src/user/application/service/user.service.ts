import { Injectable } from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/user';

//Dto
import { CreateUserDto } from '../dto/user.input';

//Input port
import { CreateUserUseCase } from '../../domain/usecase/create-user.usecase';
import { GetUserUseCase } from '../../domain/usecase/get-user.usecase';

//Output port
import { CreateUserPort } from 'src/user/domain/port/create-user.port';
import { GetUserPort } from 'src/user/domain/port/get-user.port';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements CreateUserUseCase, GetUserUseCase {
  constructor(
    private _createUserPort: CreateUserPort,
    private _getUserPort: GetUserPort,
  ) {}

  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    //   const isExists = await this.getUserByEmailUseCase.getUserByEmail();
    //   //if(getUserByEmail) throw new HttpException
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await this._createUserPort.saveUser(user);
    return result;
  }

  async getUser(id: number): Promise<Nullable<User>> {
    const user = await this._getUserPort.findOne(id);
    console.log(user);
    return user;
  }
}
