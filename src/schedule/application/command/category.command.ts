export class CreateCategoryCommand {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly color: string,
  ) {}
}

export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly color?: string,
  ) {}
}

export class DeleteCategoryCommand {
  constructor(public readonly id: number) {}
}
