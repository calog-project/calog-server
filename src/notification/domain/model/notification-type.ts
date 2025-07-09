export enum NotificationType {
  COMMON = 'COMMON',
  SCHEDULE_INVITE = 'SCHEDULE_INVITED',
  FOLLOW_REQUESTED = 'FOLLOW_REQUESTED',
  FOLLOWED = 'FOLLOWED',
}

export type NotificationMeta =
  | {
      context: NotificationType.FOLLOW_REQUESTED;
      followerId: number;
    }
  | {
      context: NotificationType.FOLLOWED;
      followerId: number;
    }
  | {
      context: NotificationType.SCHEDULE_INVITE;
      scheduleId: number;
      inviterId: number;
    }
  | {
      context: NotificationType.COMMON;
    };
