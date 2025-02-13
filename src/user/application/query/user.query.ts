export class GetUserQuery {
  constructor(public readonly id: number) {}
}

export class GetUsersQuery {
  constructor(public readonly ids: number[]) {}
}

export class GetFollowerQuery {
  constructor(
    public readonly userId: number,
    public readonly onlyApproved: boolean,
  ) {}
}
