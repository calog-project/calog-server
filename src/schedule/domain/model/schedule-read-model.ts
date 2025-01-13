export class ScheduleReadModel {
  aggregateId: string;
  id: number;
  author: number;
  title: string;
  start: Date;
  end: Date;
  categoryId?: number;
  joiner?: number[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// id: number;
// author: number;
// title: string;
// start: Date;
// end: Date;
// categoryId?: number;
