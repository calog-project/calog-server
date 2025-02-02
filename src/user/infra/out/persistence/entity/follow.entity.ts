import { Column, Entity, Index, PrimaryColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follow')
export class FollowEntity {
  @PrimaryColumn()
  @Index()
  followerId: number;

  @PrimaryColumn()
  @Index()
  followingId: number;

  @Column('boolean', { default: false })
  isApproved: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  following: UserEntity;
}
