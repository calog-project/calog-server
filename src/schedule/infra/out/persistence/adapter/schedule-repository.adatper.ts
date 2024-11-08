import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from '../../../../../common/type/CommonType';

import {
  Schedule,
  SchedulePrimitives,
} from '../../../../domain/model/schedule';
import { ScheduleSummary } from '../../../../domain/model/schedule-summary';
import { ScheduleEntity } from '../entity/schedule.entity';

import { HandleSchedulePort } from 'src/schedule/domain/port/out/handle-schedule.port';
import { LoadSchedulePort } from '../../../../domain/port/out/load-schedule.port';

import { ScheduleMapper } from '../mapper/schedule.mapper';

export class ScheduleRepositoryAdapter
  implements HandleSchedulePort, LoadSchedulePort
{
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly _scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async save(
    schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const savedSchedule = await this._scheduleRepository.save(
      ScheduleMapper.toOrmEntity(schedule),
    );
    console.log(savedSchedule);
    return savedSchedule.id;
  }

  async findById(id: number): Promise<Nullable<SchedulePrimitives>> {
    const timezone = await this._scheduleRepository.query(
      `SELECT @@session.time_zone;`,
    );
    console.log(timezone);
    const schedule = await this._scheduleRepository.findOneBy({ id });
    return schedule ? ScheduleMapper.toReadModel(schedule) : null;
  }

  async findByIds(
    ids: number[],
  ): Promise<Nullable<SchedulePrimitives>[] | ScheduleSummary[]> {
    const schedule = await this._scheduleRepository.findBy({ id: In(ids) });
    return schedule.length > 0 ? ScheduleMapper.toReadModels(schedule) : null;
  }
}
