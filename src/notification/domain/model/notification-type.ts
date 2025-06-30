export enum NotificationType {
  ACTION = 'ACTION',
  INFO = 'INFO',
}

export enum NotificationContext {
  FOLLOW_REQUESTED = 'FOLLOW_REQUESTED',
  FOLLOWED = 'FOLLOWED',
  SCHEDULE_INVITE = 'SCHEDULE_INVITED',
  'GENERAL' = 'GENERAL',
}

export type NotificationMeta =
  | {
      context: NotificationContext.FOLLOW_REQUESTED;
      followerId: number;
    }
  | {
      context: NotificationContext.FOLLOWED;
      followerId: number;
    }
  | {
      context: NotificationContext.SCHEDULE_INVITE;
      scheduleId: number;
      inviterId: number;
    }
  | {
      context: NotificationContext.GENERAL;
    };
