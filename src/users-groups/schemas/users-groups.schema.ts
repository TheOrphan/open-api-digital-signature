import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Groups } from 'src/groups/schemas/groups.schema'

export type usersGroupsDocument = usersGroups & Document;

@Schema()
export class usersGroups {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: Users;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' })
  group_id: Groups;
}

export const usersGroupsSchema = SchemaFactory.createForClass(usersGroups);
