export class GetUserQuery {
  constructor(public readonly id: number) {}
}
export class GetUsersQuery {
  constructor(public readonly ids: number[]) {}
}
