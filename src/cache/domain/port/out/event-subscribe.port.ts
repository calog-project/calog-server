export const EventSubscribePortSymbol = Symbol('EventSubscribePort');

export interface EventSubscribePort {
  subscribeToChannel(channel: string, message: string): Promise<void>;
}
