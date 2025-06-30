export const CreateNotificationUseCaseSymbol = Symbol(
  'CreateNotificationUseCase',
);

export interface CreateNotificationUseCase {
  notifyToUser(): Promise<void>;
}
