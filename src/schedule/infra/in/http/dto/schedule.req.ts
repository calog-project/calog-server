export class CreateScheduleDto {
  author: number;
  title: string;
  start: Date;
  end: Date;
  categoryId: number;
  joiner: number[];
  description: string;
}
