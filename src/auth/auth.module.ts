import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import * as config from 'config';

/**
 * Users Library
 */
import { JwtStrategy } from 'src/utils/jwt/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LogsModule } from 'src/logs/logs.module';
import { SettingsModule } from 'src/settings/settings.module';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
const jwt = config.get('jwt');

@Module({
  imports: [
    LogsModule,
    SettingsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwt.secret,
      signOptions: {
        expiresIn: jwt.expires,
      },
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
