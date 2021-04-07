import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { LogsController } from './controllers/logs.controller';
import { LogsService } from './services/logs.service';
import { LogsRepository } from './repositories/logs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Logs, LogsSchema } from './schemas/logs.schema';

const jwt = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expires,
      },
    }),
    MongooseModule.forFeature([{ name: Logs.name, schema: LogsSchema }]),
  ],
  exports: [LogsService],
  controllers: [LogsController],
  providers: [LogsRepository, LogsService],
})
export class LogsModule {}
