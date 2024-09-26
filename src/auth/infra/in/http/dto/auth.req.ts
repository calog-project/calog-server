export class LoginDto {
  email: string;
  password: string;
}

export class SocialLoginDto {
  email: string;
  provider: string;
}

export interface SocialAuthRequest {
  user: {
    email: string;
    provider: string;
  };
}
