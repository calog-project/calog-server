export const HandleNotificationPortSymbol = Symbol('HandleNotificationPort');

export interface HandleNotificationPort {
  save(): Promise<void>;
}
