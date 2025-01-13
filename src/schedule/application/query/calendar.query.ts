export class GetInitialCalendarQuery {
  constructor(
    public readonly userId: number,
    public readonly date: Date,
  ) {}
}

export class GetCalendarByPeriodQuery {
  constructor(
    public readonly userId: number,
    public readonly date: Date,
    public readonly categoryId?: number,
  ) {}
}
