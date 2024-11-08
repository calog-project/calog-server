export class CreateScheduleCommand {
  constructor(
    public readonly author: number,
    public readonly title: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly category?: string,
    public readonly joiner?: number[],
    public readonly description?: string,
  ) {}
}
