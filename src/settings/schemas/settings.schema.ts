import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';

export type SettingsDocument = Settings & mongoose.Document;

@Schema()
export class Settings extends BaseCustomSchema {
  @Prop({ type: String })
  key: string;

  @Prop({ type: String })
  value: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
