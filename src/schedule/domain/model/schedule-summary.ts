export class ScheduleSummary {
  aggregateId: string;
  id: number;
  author: number;
  title: string;
  start: Date;
  end: Date;
  category?: string;
  joiner?: number[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
