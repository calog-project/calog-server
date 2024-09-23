import { Exclude } from 'class-transformer';
import { User } from 'src/user/domain/user';
import { TokenPayload } from 'src/auth/domain/tokenPayload';

export class LoginResDto {
  @Exclude()
  userId: User;
  token: TokenPayload;
}

export class RefreshResDto {
  userId: number;
  token: TokenPayload;
}
