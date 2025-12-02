import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ScheduleParticipant } from '../../../../domain/model/schedule-participant';
import { ScheduleParticipantEntity } from '../entity/schedule-participant.entity';
import { ScheduleParticipantReadModel } from '../../../../domain/model/schedule-read-model';

import { HandleScheduleParticipantPort } from '../../../../domain/port/out/handle-schedule-participant.port';
import { LoadScheduleParticipantPort } from '../../../../domain/port/out/load-schedule-participant.port';

@Injectable()
export class ScheduleParticipantRepositoryAdapter
  implements HandleScheduleParticipantPort, LoadScheduleParticipantPort
{
  constructor(
    @InjectRepository(ScheduleParticipantEntity)
    private readonly _participantRepository: Repository<ScheduleParticipantEntity>,
  ) {}

  async bulkSave(
    participants: Omit<ScheduleParticipant, 'createdAt' | 'updatedAt'>[],
  ): Promise<number[]> {
    if (!participants.length) return [];

    const userIds = participants.map((p) => p.props.userId);

    const existing = await this._participantRepository.find({
      where: {
        scheduleId: participants[0].props.scheduleId,
        userId: In(userIds),
      },
      select: ['userId'],
    });

    const existingIds = new Set(existing.map((e) => e.userId));
    const newIds = participants
      .map((p) => p.props.userId)
      .filter((uid) => !existingIds.has(uid));
    await this._participantRepository.upsert(
      participants.map((p) => ({
        id: p.id.toString(),
        scheduleId: p.props.scheduleId,
        userId: p.props.userId,
        role: p.props.role,
        status: p.props.status,
      })),
      ['scheduleId', 'userId'],
    );

    return newIds;
  }
  async save(): Promise<void> {}

  async findByScheduleId(
    scheduleId: number,
  ): Promise<ScheduleParticipantReadModel[]> {
    const participant = await this._participantRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('user', 'u', 'u.id = p.userId')
      .where('p.scheduleId = :scheduleId', { scheduleId })
      .select([
        'p.categoryId AS category',
        'p.scheduleId AS scheduleId',
        'p.userId AS userId',
        'p.role AS role',
        'p.status AS status',
        'p.createdAt AS createdAt',
        'p.updatedAt AS updatedAt',
        'u.nickname AS nickname',
      ])
      .getRawMany();
    return participant.map((r) => ({
      categoryId: r.categoryId,
      userId: r.userId,
      nickname: r.nickname,
      role: r.role,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findByUserIds(
    userId: number[],
  ): Promise<ScheduleParticipantReadModel[]> {
    return;
  }
}
