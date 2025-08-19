export enum NotificationType {
  COMMON = 'COMMON',

  FOLLOW_REQUESTED = 'FOLLOW_REQUESTED',
  FOLLOWED = 'FOLLOWED',

  SCHEDULE_INVITED = 'SCHEDULE_INVITED',
  SCHEDULE_UPCOMING = 'SCHEDULE_UPCOMING',
  SCHEDULE_DELETED = 'SCHEDULE_DELETED',
  SCHEDULE_SHARED = 'SCHEDULE_SHARED',
}

export interface CommonMeta {
  [key: string]: any;
}

export interface FollowRequestedMeta {
  followerId: number;
  followerNickname: string;
}

export interface FollowedMeta {
  followerId: number;
  followerNickname: string;
}

export interface ScheduleUpcomingMeta {
  scheduleId: number;
  scheduleTitle: string;
  scheduleStartTime: Date;
}

export interface ScheduleInvitedMeta {
  scheduleId: number;
  scheduleTitle: string;
  inviterId: number;
  inviterNickname: string;
}

export interface ScheduleSharedMeta {
  //TODO
}

export interface ScheduleDeletedMeta {
  //TODO
}

export type NotificationMeta =
  | FollowRequestedMeta
  | FollowedMeta
  | ScheduleUpcomingMeta
  | ScheduleInvitedMeta
  | ScheduleSharedMeta
  | ScheduleDeletedMeta;

export type NotificationMetaMap = {
  [NotificationType.COMMON]: CommonMeta;

  [NotificationType.FOLLOW_REQUESTED]: FollowRequestedMeta;
  [NotificationType.FOLLOWED]: FollowedMeta;

  [NotificationType.SCHEDULE_INVITED]: ScheduleInvitedMeta;
  [NotificationType.SCHEDULE_UPCOMING]: ScheduleUpcomingMeta;
  [NotificationType.SCHEDULE_DELETED]: ScheduleDeletedMeta;
  [NotificationType.SCHEDULE_SHARED]: ScheduleSharedMeta;
};
