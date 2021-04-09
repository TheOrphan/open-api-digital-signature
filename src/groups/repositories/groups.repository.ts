import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Groups, GroupsDocument } from '../schemas/groups.schema';

@Injectable()
export class GroupsRepository {
  constructor(
    @InjectModel(Groups.name) private groupsModel: Model<GroupsDocument>,
  ) {}

  async findAll(): Promise<Groups[]> {
    return this.groupsModel.find().exec();
  }
}
