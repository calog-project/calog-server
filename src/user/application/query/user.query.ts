export class GetUserByIdQuery {
  constructor(
    public readonly id: number,
    public readonly viewerId?: number,
  ) {}
}

export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}

export class GetUsersQuery {
  constructor(public readonly ids: number[]) {}
}

export class SearchUsersQuery {
  constructor(public readonly keyword: string) {}
}

export class GetFollowerQuery {
  constructor(
    public readonly userId: number,
    public readonly onlyApproved: boolean,
  ) {}
}

export class GetFollowingQuery {
  constructor(
    public readonly userId: number,
    public readonly onlyApproved: boolean,
  ) {}
}
