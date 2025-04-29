export const SenderPortSymbol = Symbol('SenderPort');

export interface SenderPort {
  send(): Promise<void>;
}
