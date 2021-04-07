import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Contacts } from 'src/contacts/schemas/contacts.schema';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contacts' })
  contact_id: Contacts;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  login_token: string;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  ip_address: string;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Prop({ type: 'varchar', length: 200 })
  password: string;

  @Prop({ type: 'varchar', length: 200 })
  sa_user: string;

  @Prop({ type: 'varchar', length: 200 })
  sa_pass: string;

  @Prop({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  activation_code: string;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  forgotten_password_code: string;

  @Prop({ type: 'varchar', length: 50, nullable: true })
  forgotten_password_time: string;

  @Prop({ type: 'int', width: 5, default: 0 })
  quota_usage: number;

  @Prop({ type: 'int', width: 5, default: 0 })
  quota_limit: number; // -1 is unlimited

  @Prop({ type: 'varchar', length: 50, nullable: true })
  quota_desc: string;

  @Prop({ type: 'tinyint', width: 1, default: 0 })
  active: number;

  @Prop({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  last_login: Date;

  @Prop({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  created_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
