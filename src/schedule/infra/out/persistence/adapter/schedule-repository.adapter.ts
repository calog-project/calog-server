import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from '../../../../../common/type/CommonType';

import {
  Schedule,
  SchedulePrimitives,
} from '../../../../domain/model/schedule';
import { ScheduleSummary } from '../../../../domain/model/schedule-summary';
import { ScheduleEntity } from '../entity/schedule.entity';
import { UserCategoryScheduleEntity } from '../entity/user-category-schedule.entity';

import { HandleSchedulePort } from 'src/schedule/domain/port/out/handle-schedule.port';
import { LoadSchedulePort } from '../../../../domain/port/out/load-schedule.port';

import { ScheduleMapper } from '../mapper/schedule.mapper';

export class ScheduleRepositoryAdapter
  implements HandleSchedulePort, LoadSchedulePort
{
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly _scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(UserCategoryScheduleEntity)
    private readonly _userCategoryScheduleRepository: Repository<UserCategoryScheduleEntity>,
  ) {}

  async save(
    schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
    categoryId: number,
    defaultCategoryId?: number,
  ): Promise<number> {
    return await this._scheduleRepository.manager.transaction(async (txn) => {
      const savedSchedule = await txn.save(
        ScheduleMapper.toOrmEntity(schedule),
      );
      const scheduleCategoryValues = [
        txn.create(UserCategoryScheduleEntity, {
          scheduleId: savedSchedule.id,
          userId: savedSchedule.author,
          categoryId: categoryId,
        }),
      ];
      if (savedSchedule.joiner && savedSchedule.joiner.length > 0) {
        savedSchedule.joiner.forEach((joiner) =>
          scheduleCategoryValues.push(
            txn.create(UserCategoryScheduleEntity, {
              scheduleId: savedSchedule.id,
              userId: joiner,
              categoryId: defaultCategoryId,
            }),
          ),
        );
      }
      await txn
        .createQueryBuilder()
        .insert()
        .into(UserCategoryScheduleEntity)
        .values(scheduleCategoryValues)
        .execute();
      return savedSchedule.id;
    });
  }

  async update(id: number, options: Partial<Schedule>): Promise<number> {
    await this._scheduleRepository.manager.transaction(async (txn) => {
      await txn.save(options);
    });
    return;
  }
  async delete(id: number): Promise<number> {
    return;
  }

  //schedule info
  async findById(id: number): Promise<Nullable<SchedulePrimitives>> {
    const schedule = await this._scheduleRepository.findOneBy({ id });
    return schedule ? ScheduleMapper.toReadModel(schedule) : null;
  }

  async findByIds(
    ids: number[],
  ): Promise<Nullable<SchedulePrimitives>[] | ScheduleSummary[]> {
    const schedule = await this._scheduleRepository.findBy({ id: In(ids) });
    return schedule.length > 0 ? ScheduleMapper.toReadModels(schedule) : null;
  }

  async findByMonth() {}
  async findByCategory() {}
}
