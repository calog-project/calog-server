export enum NotificationType {
  COMMON = 'COMMON',

  FOLLOW_REQUESTED = 'FOLLOW_REQUESTED',
  FOLLOWED = 'FOLLOWED',

  SCHEDULE_INVITED = 'SCHEDULE_INVITED',
  SCHEDULE_UPCOMING = 'SCHEDULE_UPCOMING',
  SCHEDULE_DELETED = 'SCHEDULE_DELETED',
  SCHEDULE_SHARED = 'SCHEDULE_SHARED',
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
      context: NotificationType.SCHEDULE_INVITED;
      scheduleId: number;
      inviterId: number;
    }
  | {
      context: NotificationType.COMMON;
    };
