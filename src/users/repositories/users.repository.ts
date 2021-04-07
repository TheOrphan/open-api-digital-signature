import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../schemas/users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }
}
