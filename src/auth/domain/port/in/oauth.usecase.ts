export const OAuthUseCaseSymbol = Symbol('OAuthUseCase');

export interface OAuthUseCase {
  socialLoginOrSignup(email: string, provider: string): Promise<any>;
}
