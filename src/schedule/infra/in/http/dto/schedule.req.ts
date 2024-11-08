class CategoryDto {
  name: string;
  coler: string;
}

export class CreateScheduleDto {
  author: number;
  title: string;
  start: Date;
  end: Date;
  category: CategoryDto;
  joiner: number[];
  description: string;
}
