//payload
export const JwtPortSymbol = Symbol('JwtPort');

export interface JwtPort {
  generateAccessToken(payload: object, options?: any): string;
  generateRefreshToken(payload: object, options?: any): string;
  verify(token: string, options?: any): object;
}
