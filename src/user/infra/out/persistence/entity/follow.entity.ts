import { Column, Entity, Index, PrimaryColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { FollowStatus } from '../../../../domain/model/user-read-model';

@Entity('follow')
export class FollowEntity {
  @PrimaryColumn()
  @Index()
  followerId: number;

  @PrimaryColumn()
  @Index()
  followingId: number;

  @Column('enum', { enum: FollowStatus, default: FollowStatus.PENDING })
  status: FollowStatus;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  following: UserEntity;
}
