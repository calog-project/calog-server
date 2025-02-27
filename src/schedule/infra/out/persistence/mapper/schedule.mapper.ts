import {
  Schedule,
  SchedulePrimitives,
} from '../../../../domain/model/schedule';
import { ScheduleReadModel } from '../../../../domain/model/schedule-read-model';
import { ScheduleEntity } from '../entity/schedule.entity';

export class ScheduleMapper {
  public static toDomain(raw: ScheduleEntity): Schedule {
    return Schedule.create({
      ...raw,
    });
  }
  // public static toDomains(raws: ScheduleEntity[]): Schedule[] {
  //   return;
  // }

  public static toReadModel(raw: ScheduleEntity): ScheduleReadModel {
    const readModel: ScheduleReadModel = {
      ...raw,
    };
    return readModel;
  }

  public static toReadModels(raws: ScheduleEntity[]): ScheduleReadModel[] {
    return raws.map((raw) => {
      const readModel: ScheduleReadModel = {
        ...raw,
      };
      return readModel;
    });
  }

  public static toOrmEntity(domain: Partial<Schedule>): ScheduleEntity {
    const data = domain.toPrimitives();
    const parseId = typeof data.id === 'number' ? data.id : parseInt(data.id);
    const record = new ScheduleEntity();
    Object.assign(record, data);
    if (parseId) data.id = parseId;
    return record;
  }

  // public static toOrmEntities(users: Schedule[]): ScheduleEntity[] {
  //   return;
  // }
}
