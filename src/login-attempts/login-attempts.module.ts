import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { LoginAttemptsController } from './controllers/login-attempts.controller';
import { LoginAttemptsService } from './services/login-attempts.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoginAttempts,
  LoginAttemptsSchema,
} from './schemas/login-attempts.schema';

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
    MongooseModule.forFeature([
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
    ]),
  ],
  controllers: [LoginAttemptsController],
  providers: [LoginAttemptsService],
})
export class LoginAttemptsModule {}
