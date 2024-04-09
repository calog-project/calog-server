import { Injectable } from '@nestjs/common';

import { User } from 'src/user/domain/user';

//Dto
import { CreateUserDto } from '../dto/user.input';

//Input port
import { CreateUserUseCase } from '../../domain/usecase/create-user.usecase';
import { GetUserUseCase } from '../../domain/usecase/get-user.usecase';

//Output port
import { CreateUserPort } from 'src/user/domain/port/create-user.port';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements CreateUserUseCase {
  constructor(
    private _createUserPort: CreateUserPort,
    //email, file
  ) {}

  // async findOne() {}
  async createUser(dto: CreateUserDto): Promise<{ id: number }> {
    //   const isExists = await this.getUserByEmailUseCase.getUserByEmail();
    //   //if(getUserByEmail) throw new HttpException
    console.log(this._createUserPort);
    let user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = new User();
    user = { ...dto };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(dto.password, salt);
    await this._createUserPort.saveUser(user);
    return;
  }
}
