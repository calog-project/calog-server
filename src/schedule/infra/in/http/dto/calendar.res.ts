import { CategoryResDto } from './category.res';
import { ScheduleSummaryResDto } from './schedule.res';

export class CalendarSummaryResDto {
  categories: CategoryResDto[];
  schedules: ScheduleSummaryResDto[];
}
