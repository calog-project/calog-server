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
    public readonly id: string,
    public readonly title: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly categoryId?: string,
    public readonly joiner?: number[],
    public readonly description?: string,
  ) {}
}
export class DeleteScheduleCommand {
  constructor(public readonly id: string) {}
}

export class JoinScheduleCommand {}
export class LeaveScheduleCommand {}
