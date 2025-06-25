export const SenderPortSymbol = Symbol('SenderPort');

export interface SenderPort {
  sendNotiToUser<T>(receiverId: number, payload: T): Promise<void>;
}
