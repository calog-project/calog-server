import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * @TODO
 *    schedule - category - user 연관 필요
 * */

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  aggregateId: string;

  @Column()
  userId: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  color: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
