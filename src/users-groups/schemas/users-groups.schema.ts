import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Groups } from 'src/groups/schemas/groups.schema';

export type UsersGroupsDocument = UsersGroups & mongoose.Document;

@Schema()
export class UsersGroups {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: Users;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' })
  group_id: Groups;
}

export const UsersGroupsSchema = SchemaFactory.createForClass(UsersGroups);
