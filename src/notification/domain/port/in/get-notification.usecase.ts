export const GetNotificationUseCaseSymbol = Symbol('GetNotificationUseCase');

export interface GetNotificationUseCase {
  getNotiById(): Promise<void>;
  getNotiByUserId(): Promise<void>;
}
