export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

export class Token {
  private accessToken: string;
  private refreshToken: string;
  constructor(token: TokenPayload) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
  }
  static create(accessToken: string, refreshToken: string) {
    return new Token({ accessToken, refreshToken });
  }

  public provideToken() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }
  public getAccessToken() {
    return this.accessToken;
  }
  public getRefreshToken() {
    return this.refreshToken;
  }
}
