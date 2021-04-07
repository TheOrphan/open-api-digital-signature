import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class LoginAttempts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  ip_address: string;

  @Column({ type: 'varchar', length: 50 })
  login: string;

  @Column({ type: 'tinyint', width: 4 })
  time: number;
}
