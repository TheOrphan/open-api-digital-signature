import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from '../schemas/login-attempts.schema';

@Injectable()
export class LoginAttemptsRepository {
  constructor(
    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttemptsDocument>,
  ) {}

  async findAll(): Promise<LoginAttempts[]> {
    return this.loginAttemptsModel.find().exec();
  }
}
