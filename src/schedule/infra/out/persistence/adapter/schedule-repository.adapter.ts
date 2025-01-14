import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Nullable } from '../../../../../common/type/CommonType';

import {
  Schedule,
  SchedulePrimitives,
} from '../../../../domain/model/schedule';
import { ScheduleReadModel } from '../../../../domain/model/schedule-read-model';
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
    //리팩토링
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

  async update(
    schedule: Partial<Schedule>,
    userId: number,
    categoryId: number,
  ): Promise<number> {
    await this._scheduleRepository.manager.transaction(async (txn) => {
      await txn.save(ScheduleMapper.toOrmEntity(schedule));
      if (categoryId) {
        const relationRecord = await txn.findOneBy(UserCategoryScheduleEntity, {
          userId,
          scheduleId: schedule.dbId,
        });
        await txn
          .createQueryBuilder()
          .update(UserCategoryScheduleEntity)
          .set({ categoryId })
          .where(relationRecord)
          .execute();
      }
    });
    return schedule.dbId;
  }
  async delete(id: number): Promise<number> {
    return;
  }

  //schedule info
  async findById(id: number): Promise<Nullable<SchedulePrimitives>> {
    const schedule = await this._scheduleRepository.findOneBy({ id });
    return schedule ? ScheduleMapper.toReadModel(schedule) : null;
  }

  async findByIds(ids: number[]): Promise<Nullable<ScheduleReadModel[]>> {
    const schedule = await this._scheduleRepository.findBy({ id: In(ids) });
    return schedule.length > 0 ? ScheduleMapper.toReadModels(schedule) : null;
  }

  async findByUserIdAndPeriod(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<ScheduleReadModel[]> {
    const ucsArr = await this._userCategoryScheduleRepository
      .createQueryBuilder('ucs')
      .innerJoinAndSelect('ucs.schedule', 'schedule')
      .where('ucs.userId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('schedule.start BETWEEN :start AND :end', {
            start,
            end,
          }).orWhere('schedule.end BETWEEN :start AND :end', {
            start,
            end,
          });
        }),
      )
      .getMany();
    const scheduleEntities = ucsArr.map((ucs) => ucs.schedule);
    const readModels = ScheduleMapper.toReadModels(scheduleEntities);
    readModels.map((readModel, idx) => {
      readModel.categoryId = ucsArr[idx].categoryId;
    });
    return readModels;
  }

  async findUserCategoryMappings(): Promise<any> {
    return;
  }
}
