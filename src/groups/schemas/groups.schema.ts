import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';

// @Entity()
// export class Groups extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 50 })
//   name: string;

//   @Column({ type: 'int', width: 3 })
//   level: number;

//   @Column({ type: 'varchar', length: 50 })
//   description: string;
// }

export type GroupsDocument = Groups & Document;

@Schema()
export class Groups extends BaseCustomSchema{
  @Prop([String])
  
  name: string;
  @Prop([String])
  lavel: string;

  @Prop([String])
  description: string;
}

export const GroupSchema = SchemaFactory.createForClass(Groups);
