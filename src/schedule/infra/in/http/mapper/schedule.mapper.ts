import { SchedulePrimitives } from '../../../../domain/model/schedule';
import { ScheduleReadModel } from '../../../../domain/model/schedule-read-model';

import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.req';
import {
  ScheduleDetailResDto,
  ScheduleSummaryResDto,
} from '../dto/schedule.res';

import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  UpdateScheduleCommand,
} from '../../../../application/command/schedule.command';
import { GetScheduleDetailQuery } from '../../../../application/query/schedule.query';
import { DateTimeUtil } from '../../../../../common/util/date-time.util';

export class ScheduleMapper {
  static toCommand<T extends CreateScheduleDto | UpdateScheduleDto>(
    id?: number,
    dto?: T,
  ): CreateScheduleCommand | UpdateScheduleCommand | DeleteScheduleCommand {
    if (!id && dto && dto instanceof CreateScheduleDto) {
      return new CreateScheduleCommand(
        dto.author,
        dto.title,
        dto.start,
        dto.end,
        dto.categoryId,
        dto.joiner,
        dto.description,
      );
    } else if (id && dto && dto instanceof UpdateScheduleDto) {
      return new UpdateScheduleCommand(
        id,
        dto.userId,
        dto.title,
        dto.start,
        dto.end,
        dto.categoryId,
        dto.description,
      );
    } else if (id && !dto) {
      return new DeleteScheduleCommand(id);
    }
  }

  static toQuery(id: number): GetScheduleDetailQuery {
    return new GetScheduleDetailQuery(id);
  }

  static toDto(view: SchedulePrimitives): ScheduleDetailResDto;
  static toDto(view: ScheduleReadModel[]): ScheduleSummaryResDto[];
  static toDto(
    view: SchedulePrimitives | ScheduleReadModel[],
  ): ScheduleDetailResDto | ScheduleSummaryResDto[] {
    if (Array.isArray(view)) {
      return view.map((schedule) => {
        return new ScheduleSummaryResDto({
          ...schedule,
          aggregateId: schedule.aggregateId,
          id: schedule.id,
          categoryId: schedule.categoryId,
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
        // categoryId: view.categoryId,
        start: DateTimeUtil.toKst(view.start),
        end: DateTimeUtil.toKst(view.end),
        createdAt: DateTimeUtil.toKst(view.createdAt),
        updatedAt: DateTimeUtil.toKst(view.updatedAt),
      });
    }
  }
}
