// export enum NotificationType {
//   ACTION = 'ACTION',
//   INFO = 'INFO',
// }

export enum NotificationType {
  FOLLOW_REQUESTED = 'FOLLOW_REQUESTED',
  FOLLOWED = 'FOLLOWED',
  SCHEDULE_INVITE = 'SCHEDULE_INVITED',
  'GENERAL' = 'GENERAL',
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
      context: NotificationType.GENERAL;
    };
