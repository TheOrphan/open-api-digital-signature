import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from '../schemas/settings.schema';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  async findAll(): Promise<Settings[]> {
    return this.settingsModel.find().exec();
  }
}
