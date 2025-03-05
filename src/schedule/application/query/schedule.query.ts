export class GetScheduleDetailQuery {
  constructor(
    public readonly userId: number,
    public readonly scheduleId: number,
  ) {}
}

export class GetManyScheduleQuery {
  constructor(public readonly ids: number[]) {}
}
