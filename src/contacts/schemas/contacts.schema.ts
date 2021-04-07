import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';
import { Document } from 'mongoose';

// @Entity()
// export class Contacts extends BaseCustomEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 50 })
//   first_name: string;

//   @Column({ type: 'varchar', length: 50 })
//   last_name: string;

//   @Column({ type: 'varchar', length: 13 })
//   phone: string;

//   @Column({ type: 'varchar', length: 100 })
//   address: string;

//   @Column({ type: 'enum' })
//   type: string;
// }
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
