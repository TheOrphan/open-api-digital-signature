import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { LoginAttemptsController } from './controllers/login-attempts.controller';
import { LoginAttemptsService } from './services/login-attempts.service';
import { LoginAttemptsRepository } from './repositories/login-attempts.repository';

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
    TypeOrmModule.forFeature([LoginAttemptsRepository]),
  ],
  controllers: [LoginAttemptsController],
  providers: [LoginAttemptsService],
})
export class LoginAttemptsModule {}
