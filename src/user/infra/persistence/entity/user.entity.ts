import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Nullable } from 'src/common/type/CommonType';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  //optional : for SSO
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ default: 'local' })
  provider: string;

  @Column('varchar', { unique: true, nullable: true })
  nickname: Nullable<string>;

  @Column('varchar', { nullable: true })
  description: Nullable<string>;

  @Column('varchar', { nullable: true })
  image: Nullable<string>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // constructor(domain: User) {
  //   }
}
