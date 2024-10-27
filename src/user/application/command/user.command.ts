export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password?: string,
    public readonly provider?: string,
    public readonly nickname?: string,
    public readonly image?: string,
    public readonly description?: string,
  ) {}
}

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly nickname?: string,
    public readonly image?: string,
    public readonly description?: string,
  ) {}
}
