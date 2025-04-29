export const LoadNotificationPortSymbol = Symbol('LoadNotificationPort');

export interface LoadNotificationPort {
  findById(id: number): Promise<void>;

  findByUserId(userId: number): Promise<void>;
}
