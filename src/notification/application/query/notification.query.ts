export class GetNotificationsByUserIdQuery {
  constructor(
    public readonly userId: number,
    public readonly limit: number,
    public readonly cursor?: number,
  ) {}
}
