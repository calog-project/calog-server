export class CreateScheduleDto {
  author: number;
  title: string;
  start: Date;
  end: Date;
  categoryId: number;
  joiner: number[];
  description: string;
}

export class UpdateScheduleDto {
  userId: number;
  title: string;
  start: Date;
  end: Date;
  categoryId: number;
  description: string;
}

export class getCalendarDto {
  userId: number;
  date: Date;
  categoryId: number;
}
