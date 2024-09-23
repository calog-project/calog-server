import { Token } from 'src/auth/domain/token';
import { User } from 'src/user/domain/model/user';

export class LoginResDto {
  id: number | string;
  email: string;

  provider: string;

  image: string;
  nickname: string;
  description: string;

  token: {
    accessToken: string;
    refreshToken: string;
  };
  constructor(user: User, token: Token) {
    const userData = user.toPrimitives();
    this.id = userData.id;
    this.email = userData.email;
    this.provider = userData.provider;

    this.image = userData.image;
    this.nickname = userData.nickname;
    this.description = userData.description;

    this.token = token.provideToken();
  }

  static of(user: User, token: Token) {
    return new LoginResDto(user, token);
  }
}

// export class LoginResDto {
//   user: User;
//   token: Token;

//   constructor() {}
//   static of() {}
// }

export class RefreshResDto {
  userId: number;
  token: Token;
}
