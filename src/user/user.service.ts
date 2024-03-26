import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/user.input';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  construtor() {}

  async findOne() {}
  async createUser(dto: SignupDto): Promise<object> {
    //validate
    //if(getUserByEmail) throw new HttpException
    const user = { ...dto };
    //패스워드 암호화
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    user.password = hash;

    return user;
  }
}
