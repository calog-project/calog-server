export const CreateNotificationUseCaseSymbol = Symbol(
  'CreateNotificationUseCase',
);

export interface CreateNotificationUseCase {
  create(): Promise<void>;
}
