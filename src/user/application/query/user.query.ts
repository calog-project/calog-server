export class GetUserByIdQuery {
  constructor(
    public readonly targetId: number,
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
  constructor(
    public readonly mode: string,
    public readonly keyword: string,
    public readonly limit: number,
    public readonly offset?: number,
    public readonly cursor?: string,
  ) {}
}

export class GetFollowerQuery {
  constructor(
    public readonly viewerId: number,
    public readonly targetId: number,
    public readonly onlyApproved: boolean,
    public readonly limit: number,
    public readonly cursor?: number,
  ) {}
}

export class GetFollowingQuery {
  constructor(
    public readonly viewerId: number,
    public readonly targetId: number,
    public readonly onlyApproved: boolean,
    public readonly limit: number,
    public readonly cursor?: number,
  ) {}
}
