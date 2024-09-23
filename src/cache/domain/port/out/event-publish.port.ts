export const EventPublishPortSymbol = Symbol('EventPublishPort');

export interface EventPublishPort {
  publishToChannel(channel: string, message: string): Promise<void>;
}
