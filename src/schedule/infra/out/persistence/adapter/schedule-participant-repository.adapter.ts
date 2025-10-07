import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ScheduleParticipant } from '../../../../domain/model/schedule-participant';
import { ScheduleParticipantEntity } from '../entity/schedule-participant.entity';

import { HandleScheduleParticipantPort } from '../../../../domain/port/out/handle-schedule-participant.port';

@Injectable()
export class ScheduleParticipantRepositoryAdapter
  implements HandleScheduleParticipantPort
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
}
