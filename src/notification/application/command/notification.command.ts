export class SendNotificationCommand {
  constructor() {}
}

export class ScheduleInvitedNotificationCommand {
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
