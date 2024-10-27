export abstract class Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
  ) {}
}
