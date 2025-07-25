export class PaginatedResponse<T> {
  items: T[];
  limit: number;
}

export class OffsetPaginatedResponse<T> extends PaginatedResponse<T> {
  totalCount: number;
  offset: number;
  hasNext?: boolean;
}

export class CursorPaginatedResponse<T, C> extends PaginatedResponse<T> {
  cursor: C;
  hasNext?: boolean;
}

export abstract class BasePaginationResponse<M = undefined> {
  limit: number;
  offset?: number;
  total?: number;

  cursor?: M;

  protected constructor(options: {
    limit: number;
    cursor?: M;
    offset?: number;
    total?: number;
  }) {
    this.limit = options.limit;
    this.cursor = options.cursor;
    this.offset = options.offset;
    this.total = options.total;
  }
}
