import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';
// import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

// @Entity()
// export class Settings extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   key: string;

//   @Column({ type: 'varchar', length: 255 })
//   value: string;
// }


export type SettingsDocument = Settings & Document;

@Schema()
export class Settings extends BaseCustomSchema {
  @Prop([String])
  key: string;

  @Prop([String])
  value: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

