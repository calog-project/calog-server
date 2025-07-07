import { Notification } from '../../model/notification';

export const SenderPortSymbol = Symbol('SenderPort');

export interface SenderPort {
  sendNotiToUser(receiverId: number, noti: Notification): Promise<void>;
}
