import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { LogsModule } from 'src/logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';

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
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: Users.name,
    //     useFactory: () => {
    //       const schema = UsersSchema;
    //       schema.post('save', function() {
    //         Users.updated_at = Date.now();
    //       });
    //       return schema;
    //     },
    //   },
    // ]),
  ],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
