import { registerAs } from '@nestjs/config';

export type AuthConfig = {
  jwtAccessSecret: string;
  jwtAccessExpirationTime: number;
  jwtRefreshSecret: string;
  jwtRefreshExpirationTime: number;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  googleScope: Array<string>;
  kakaoClientId: string;
  kakaoClientSecret: string;
  kakaoCallbackUrl: string;
};

export default registerAs<AuthConfig>('auth', () => {
  return {
    //jwt
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtAccessExpirationTime: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    ),
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpirationTime: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    ),
    //google
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    googleScope: [process.env.GOOGLE_SCOPE_1, process.env.GOOGLE_SCOPE_2],
    //kakao
    kakaoClientId: process.env.KAKAO_CLIENT_ID,
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET,
    kakaoCallbackUrl: process.env.KAKAO_CALLBACK_URL,
  };
});
