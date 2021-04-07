import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs, LogsDocument } from '../schemas/logs.schema';

@Injectable()
export class LogsRepository {
  constructor(@InjectModel(Logs.name) private logsModel: Model<LogsDocument>) {}

  async findAll(): Promise<Logs[]> {
    return this.logsModel.find().exec();
  }
}
