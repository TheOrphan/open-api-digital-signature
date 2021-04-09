import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';
import { Document } from 'mongoose';

export type ContactsDocument = Contacts & Document;

@Schema()
export class Contacts extends BaseCustomSchema {
  @Prop([String])
  first_name: string;

  @Prop([String])
  last_name: string;

  @Prop([String])
  phone: string;

  @Prop([String])
  address: string;

  @Prop([String])
  type: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
