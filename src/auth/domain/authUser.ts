import { User } from 'src/user/domain/user';
// import { Token, TokenPayload } from './tokenPayload';
import { TokenPayload } from './tokenPayload';

export class AuthUser {
  constructor(
    private user: User,
    private token: TokenPayload,
  ) {}

  static create(user: User, token: TokenPayload) {
    return new AuthUser(user, token);
  }
}
