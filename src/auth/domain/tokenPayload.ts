export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

// export class Token {
//   constructor(
//     private accessToken: string,
//     private refreshToken: string,
//   ) {}

//   public setHashedRefreshToken(hashedToken: string) {
//     this.refreshToken = hashedToken;
//   }
// }
