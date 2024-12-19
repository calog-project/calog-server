import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

/**
 * @TODO
 *    schedule - category - user 연관 필요
 * */

@Entity('category')
@Unique(['userId', 'name'])
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  aggregateId: string;

  @Index()
  @Column()
  userId: number;

  @Index()
  @Column('varchar')
  name: string;

  @Column('varchar')
  color: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
