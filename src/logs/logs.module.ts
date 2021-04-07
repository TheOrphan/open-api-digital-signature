import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { LogsController } from './controllers/logs.controller';
import { LogsService } from './services/logs.service';
import { LogsRepository } from './repositories/logs.repository';

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
    TypeOrmModule.forFeature([LogsRepository]),
  ],
  exports: [LogsService],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
