export class GetCategoryQuery {
  constructor(public readonly id: number) {}
}

export class GetCategoriesByUserIdQuery {
  constructor(public readonly userId: number) {}
}
