import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Logs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Users)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @Column({ type: 'varchar', length: 50 })
  activity: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  created_at: Date;
}
