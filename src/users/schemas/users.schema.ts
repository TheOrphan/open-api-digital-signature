import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Contacts } from 'src/contacts/schemas/contacts.schema';

export type UsersDocument = Users & mongoose.Document;

@Schema()
export class Users {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contacts' })
  contact_id: Contacts;

  // @Prop({ type: String })
  // peruri_token: string;

  @Prop({ type: String })
  ip_address: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  activation_code: string;

  @Prop({ type: String })
  forgotten_password_code: string;

  @Prop({ type: String })
  forgotten_password_time: string;

  @Prop({ type: Number })
  active: number;

  @Prop({
    type: String,
    required: true,
  })
  last_login: string;

  @Prop({
    type: String,
    required: true,
  })
  created_at: string;

  @Prop({
    type: String,
  })
  updated_at: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
