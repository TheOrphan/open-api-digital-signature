import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as config from 'config';

/**
 * User Library
 */
import { AllExceptionsFilter } from './utils/exception/all-exceptions.filter';
import { AppModule } from './app.module';
import { swagger } from './utils/swagger';

// swagger
import { AuthModule as Auth } from './auth/auth.module';
import { UsersModule as Users } from './users/users.module';
import { CompaniesModule as Companies } from './companies/companies.module';
import { ContactsModule as Contacts } from './contacts/contacts.module';
import { GroupsModule as Groups } from './groups/groups.module';
import { LoginAttemptsModule as LoginAttempts } from './login-attempts/login-attempts.module';
import { LogsModule as Logs } from './logs/logs.module';
import { UsersGroupsModule as UsersGroups } from './users-groups/users-groups.module';
import { SettingsModule as Settings } from './settings/settings.module';
import { VideosModule as Videos } from './videos/videos.module';

const server = config.get('server');

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  // ========== swagger ===========
  swagger('api/auth', app, 'Auth', Auth);
  swagger('api/companies', app, 'Companies', Companies);
  swagger('api/contacts', app, 'Contacts', Contacts);
  swagger('api/groups', app, 'Groups', Groups);
  swagger('api/login-attempts', app, 'Login attempts', LoginAttempts);
  swagger('api/logs', app, 'Logs', Logs);
  swagger('api/settings', app, 'Settings', Settings);
  swagger('api/users', app, 'Users', Users);
  swagger('api/users-groups', app, 'Users groups', UsersGroups);
  swagger('api/videos-verification', app, 'Videos Verification', Videos);
  // ========== swagger ===========

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /**
   * Enable Cors di sini lebih baik daripada setup di file htaccess
   * Karena kalau di htaccess, bisa banyak error dan berbeda
   * So disable cors yang di htaccess
   */
  app.enableCors();

  await app.listen(server.port);
  logger.log(`Application listening on port ${server.port}`);
}
bootstrap();
