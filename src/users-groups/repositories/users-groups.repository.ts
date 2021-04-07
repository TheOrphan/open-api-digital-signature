import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UsersGroups,
  UsersGroupsDocument,
} from '../schemas/users-groups.schema';

@Injectable()
export class UsersGroupsRepository {
  constructor(
    @InjectModel(UsersGroups.name)
    private usersModel: Model<UsersGroupsDocument>,
  ) {}

  async findAll(): Promise<UsersGroups[]> {
    return this.usersModel.find().exec();
  }
}
