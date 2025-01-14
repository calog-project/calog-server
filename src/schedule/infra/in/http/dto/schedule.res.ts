export class ScheduleDetailResDto {
  public readonly aggregateId: string;
  public readonly id: number;
  public readonly author: number;
  public readonly title: string;
  public readonly start: string;
  public readonly end: string;
  public readonly category?: string;
  public readonly joiner?: number[];
  public readonly description?: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  constructor(props: ScheduleDetailResDto) {
    this.aggregateId = props.aggregateId;
    this.id = props.id;
    this.author = props.author;
    this.title = props.title;
    this.start = props.start;
    this.end = props.end;
    this.category = props.category;
    this.joiner = props.joiner;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

export class ScheduleSummaryResDto {
  public readonly aggregateId: string;
  public readonly id: number;
  public readonly author: number;
  public readonly title: string;
  public readonly categoryId: number;
  public readonly start: string;
  public readonly end: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  constructor(props: ScheduleSummaryResDto) {
    this.aggregateId = props.aggregateId;
    this.id = props.id;
    this.author = props.author;
    this.title = props.title;
    this.categoryId = props.categoryId;
    this.start = props.start;
    this.end = props.end;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
