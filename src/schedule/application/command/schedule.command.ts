export class CreateScheduleCommand {
  constructor(
    public readonly author: number,
    public readonly title: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly categoryId: number,
    public readonly joiner?: number[],
    public readonly description?: string,
  ) {}
}
export class UpdateScheduleCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly title?: string,
    public readonly start?: Date,
    public readonly end?: Date,
    public readonly categoryId?: number,
    public readonly description?: string,
  ) {}
}
export class DeleteScheduleCommand {
  constructor(public readonly id: number) {}
}

export class JoinScheduleCommand {}
export class LeaveScheduleCommand {}
