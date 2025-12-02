import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, In, Repository } from 'typeorm';
import { Nullable } from '../../../../../common/type/CommonType';

import {
  Schedule,
  SchedulePrimitives,
} from '../../../../domain/model/schedule';
import { ScheduleReadModel } from '../../../../domain/model/schedule-read-model';
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

  withManager(em: EntityManager): HandleSchedulePort & LoadSchedulePort {
    return new ScheduleRepositoryAdapter(em.getRepository(ScheduleEntity));
  }

  async save(
    schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    //리팩토링
    const savedSchedule = await this._scheduleRepository.save(
      ScheduleMapper.toOrmEntity(schedule),
    );
    return savedSchedule.id;
  }

  async update(
    schedule: Partial<Schedule>,
    userId: number,
    categoryId: number,
  ): Promise<number> {
    await this._scheduleRepository.save(ScheduleMapper.toOrmEntity(schedule));
    return schedule.dbId;
    // await this._scheduleRepository.manager.transaction(async (txn) => {
    //   if (categoryId) {
    //     const relationRecord = await txn.findOneBy(UserCategoryScheduleEntity, {
    //       userId,
    //       scheduleId: schedule.dbId,
    //     });
    //     await txn
    //       .createQueryBuilder()
    //       .update(UserCategoryScheduleEntity)
    //       .set({ categoryId })
    //       .where(relationRecord)
    //       .execute();
    //   }
    // });
  }

  async delete(id: number): Promise<number> {
    await this._scheduleRepository.delete(id);
    // await this._scheduleRepository.manager.transaction(async (txn) => {
    //   await txn
    //     .createQueryBuilder()
    //     .delete()
    //     .from(UserCategoryScheduleEntity)
    //     .where('scheduleId = :id', { id })
    //     .execute();
    //   await txn.getRepository(ScheduleEntity).delete({ id });
    // });

    return id;
  }

  //schedule info
  async findById(id: number): Promise<Nullable<ScheduleReadModel>> {
    const schedule = await this._scheduleRepository.findOneBy({ id });
    return schedule ? ScheduleMapper.toReadModel(schedule) : null;
  }

  // async findById(
  //   id: number,
  //   userId?: number,
  // ): Promise<Nullable<ScheduleReadModel>> {
  //   if (!userId) {
  //     const schedule = await this._scheduleRepository.findOneBy({ id });
  //     return schedule ? ScheduleMapper.toReadModel(schedule) : null;
  //   } else {
  //     const ucs = await this._userCategoryScheduleRepository
  //       .createQueryBuilder('ucs')
  //       .innerJoinAndSelect('ucs.schedule', 'schedule')
  //       .where('ucs.userId = :userId', { userId })
  //       .andWhere('ucs.scheduleId = :scheduleId', { scheduleId: id })
  //       .getOne();
  //     if (!ucs) {
  //       return null;
  //     } else {
  //       const readModel = ScheduleMapper.toReadModel(ucs.schedule);
  //       readModel.categoryId = ucs.categoryId;
  //       return readModel;
  //     }
  //   }
  // }

  async findByIds(ids: number[]): Promise<Nullable<ScheduleReadModel[]>> {
    const schedule = await this._scheduleRepository.findBy({ id: In(ids) });
    return schedule.length > 0 ? ScheduleMapper.toReadModels(schedule) : null;
  }

  async findByUserIdAndPeriod(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<ScheduleReadModel[]> {
    return;
  }

  // async findByUserIdAndPeriod(
  //   userId: number,
  //   start: Date,
  //   end: Date,
  // ): Promise<ScheduleReadModel[]> {
  //   const ucsArr = await this._userCategoryScheduleRepository
  //     .createQueryBuilder('ucs')
  //     .innerJoinAndSelect('ucs.schedule', 'schedule')
  //     .where('ucs.userId = :userId', { userId })
  //     .andWhere(
  //       new Brackets((qb) => {
  //         qb.where('schedule.start BETWEEN :start AND :end', {
  //           start,
  //           end,
  //         }).orWhere('schedule.end BETWEEN :start AND :end', {
  //           start,
  //           end,
  //         });
  //       }),
  //     )
  //     .getMany();
  //   const scheduleEntities = ucsArr.map((ucs) => ucs.schedule);
  //   const readModels = ScheduleMapper.toReadModels(scheduleEntities);
  //   readModels.map((readModel, idx) => {
  //     readModel.categoryId = ucsArr[idx].categoryId;
  //   });
  //   return readModels;
  // }

  async findUserCategoryMappings(): Promise<any> {
    return;
  }
}
