import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';

export type LogsDocument = Logs & mongoose.Document;

@Schema()
export class Logs {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: Users;

  @Prop({ type: String })
  activity: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  module: string;

  @Prop({ type: String })
  created_at: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
