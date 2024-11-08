import { SchedulePrimitives } from '../../../../domain/model/schedule';
import { ScheduleSummary } from '../../../../domain/model/schedule-summary';

import { CreateScheduleDto } from '../dto/schedule.req';
import {
  ScheduleDetailResDto,
  ScheduleSummaryResDto,
} from '../dto/schedule.res';

import { CreateScheduleCommand } from '../../../../application/command/schedule.command';
import { GetScheduleDetailQuery } from '../../../../application/query/schedule.query';
import { DateTimeUtil } from '../../../../../common/util/date-time.util';

export class ScheduleMapper {
  static toCommand(dto: CreateScheduleDto): CreateScheduleCommand;
  static toCommand(dto: CreateScheduleDto): CreateScheduleCommand {
    if (dto && dto instanceof CreateScheduleDto) {
      return new CreateScheduleCommand(
        dto.author,
        dto.title,
        new Date(dto.start),
        new Date(dto.end),
        dto.category.name,
        dto.joiner,
        dto.description,
      );
    }
  }

  static toQuery(id: number): GetScheduleDetailQuery {
    return new GetScheduleDetailQuery(id);
  }

  static toDto(view: SchedulePrimitives): ScheduleDetailResDto;
  static toDto(view: ScheduleSummary[]): ScheduleSummaryResDto[];
  static toDto(
    view: SchedulePrimitives | ScheduleSummary[],
  ): ScheduleDetailResDto | ScheduleSummaryResDto[] {
    if (Array.isArray(view)) {
      return view.map((schedule) => {
        return new ScheduleSummaryResDto({
          ...schedule,
          aggregateId: schedule.aggregateId,
          id: schedule.id,
          start: DateTimeUtil.toKst(schedule.start),
          end: DateTimeUtil.toKst(schedule.end),
          createdAt: DateTimeUtil.toKst(schedule.createdAt),
          updatedAt: DateTimeUtil.toKst(schedule.updatedAt),
        });
      });
    } else {
      return new ScheduleDetailResDto({
        ...view,
        aggregateId: view.aggregateId,
        id: view.id,
        start: DateTimeUtil.toKst(view.start),
        end: DateTimeUtil.toKst(view.end),
        createdAt: DateTimeUtil.toKst(view.createdAt),
        updatedAt: DateTimeUtil.toKst(view.updatedAt),
      });
    }
  }
}
