import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  receiverId: number;

  @Column('simple-json')
  meta?: Record<string, any>;

  @Column('varchar')
  message: string;

  @Column('varchar', { nullable: true })
  url: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('boolean')
  actionable: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
