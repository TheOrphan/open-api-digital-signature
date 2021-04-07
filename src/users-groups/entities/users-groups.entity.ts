import { Groups } from 'src/groups/entities/groups.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UsersGroups extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Users)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @OneToOne(type => Groups)
  @JoinColumn({ name: 'group_id' })
  group_id: Groups;
}
