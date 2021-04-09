import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { UsersGroupsService } from './services/users-groups.service';
import { UsersGroupsController } from './controllers/users-groups.controller';
import { LogsModule } from 'src/logs/logs.module';
import { UsersGroups, UsersGroupsSchema } from './schemas/users-groups.schema';
import { MongooseModule } from '@nestjs/mongoose';

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
    MongooseModule.forFeature([
      { name: UsersGroups.name, schema: UsersGroupsSchema },
    ]),
  ],
  providers: [UsersGroupsService],
  controllers: [UsersGroupsController],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}
