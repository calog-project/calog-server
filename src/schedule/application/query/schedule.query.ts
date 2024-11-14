export class GetScheduleDetailQuery {
  constructor(public readonly id: number) {}
}

export class GetManyScheduleQuery {
  constructor(public readonly ids: number[]) {}
}
