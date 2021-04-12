import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';
const dbConfig = config.get('db');

/**
 * User Library
 */
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { VideosModule } from './videos/videos.module';
import { GroupsModule } from './groups/groups.module';
import { LoginAttemptsModule } from './login-attempts/login-attempts.module';
import { LogsModule } from './logs/logs.module';
import { UsersGroupsModule } from './users-groups/users-groups.module';
import { SettingsModule } from './settings/settings.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.database),
    UsersModule,
    AuthModule,
    CompaniesModule,
    ContactsModule,
    GroupsModule,
    LoginAttemptsModule,
    LogsModule,
    UsersGroupsModule,
    SettingsModule,
    VideosModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
