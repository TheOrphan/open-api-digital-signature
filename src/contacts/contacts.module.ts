import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { ContactsController } from './controllers/contacts.controller';
import { ContactsService } from './services/contacts.service';
import { ContactsRepository } from './repositories/contacts.repository';
import { LogsModule } from 'src/logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './schemas/contacts.schema';
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
    // TypeOrmModule.forFeature([ContactsRepository]),
    MongooseModule.forFeature([
      {name: Contacts.name,schema: ContactsSchema},
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
