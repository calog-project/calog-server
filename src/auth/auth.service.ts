import { Injectable } from '@nestjs/common';

interface IAuthServiceLogin {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  async login({ email, password }: IAuthServiceLogin): Promise<object> {
    if (email == 'test' && password == 'password123') {
      return { statusCode: 201, message: '로그인에 성공하였습니다!' };
    } else {
      return { statusCode: 401, message: '유효하지 않습니다!' };
    }
  }
}
