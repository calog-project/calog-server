export const SendNotificationUseCaseSymbol = Symbol('SendNotificationUseCase');

export interface SendNotificationUseCase {
  send(): Promise<void>;
}
