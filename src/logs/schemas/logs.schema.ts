import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';

export type logDocument = Log & Document;

@Schema()
export class Log {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: Users;

  @Prop({ type: 'varchar' })
  activity: string;

  @Prop({ type: 'string' })
  content: string;

  @Prop({ type: 'string' })
  module: string;

  @Prop({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  created_at: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
