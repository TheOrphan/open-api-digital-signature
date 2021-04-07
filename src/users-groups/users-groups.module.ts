import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { UsersGroupsService } from './services/users-groups.service';
import { UsersGroupsController } from './controllers/users-groups.controller';
import { UsersGroupsRepository } from './repositories/users-groups.repository';
import { LogsModule } from 'src/logs/logs.module';
const jwt = config.get('jwt');

@Module({
  imports: [
    LogsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expires,
      },
    }),
    TypeOrmModule.forFeature([UsersGroupsRepository]),
  ],
  providers: [UsersGroupsService],
  controllers: [UsersGroupsController],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}
