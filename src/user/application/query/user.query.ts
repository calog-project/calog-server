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

export class GetFollowingQuery {
  constructor(public readonly userId: number,
  public readonly onlyApproved: boolean,
  ) {}
}

export class SearchUsersQuery {
  constructor(public readonly keyword: string) {}
}
