export class SendNotificationCommand {
  constructor() {}
}

export class ScheduleCreatedNotificationCommand {
  constructor() {}
}

export class FollowedNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly followerId: string,
    public readonly followerNickname: string,
  ) {}
}

export class FollowRequestedNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly followerId: string,
    public readonly followerNickname: string,
  ) {}
}

export class ScheduleInvitedNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly scheduleId: number,
    public readonly scheduleTitle: string,
    public readonly inviterId: number,
    public readonly inviterNickname: string,
  ) {}
}

export class ScheduleUpcomingNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly scheduleId: number,
    public readonly scheduleTitle: string,
    public readonly scheduleStartTime: Date,
  ) {}
}

export class ScheduleDeletedNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly scheduleId: number,
    public readonly scheduleTitle: string,
  ) {}
}

export class ScheduleSharedNotificationCommand {
  constructor(
    public readonly receiverId: number,
    public readonly scheduleId: number,
    public readonly scheduleTitle: string,
  ) {}
}
