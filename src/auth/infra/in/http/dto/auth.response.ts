import { User } from 'src/user/domain/user';

export class LoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
