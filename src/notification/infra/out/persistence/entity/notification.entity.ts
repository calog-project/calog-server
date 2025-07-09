import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../../../../domain/model/notification-type';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  aggregateId: string;

  @Index()
  @Column()
  receiverId: number;

  @Column('enum', { enum: NotificationType, default: NotificationType.COMMON })
  type: NotificationType;

  @Column('simple-json')
  meta?: Record<string, any>;

  @Column('varchar')
  message: string;

  @Column('varchar', { nullable: true })
  url: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('boolean', { default: false })
  actionable: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
