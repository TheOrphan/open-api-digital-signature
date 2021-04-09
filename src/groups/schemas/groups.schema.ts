import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';

export type GroupsDocument = Groups & mongoose.Document;

@Schema()
export class Groups extends BaseCustomSchema {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  level: string;

  @Prop({ type: String })
  description: string;
}

export const GroupsSchema = SchemaFactory.createForClass(Groups);
