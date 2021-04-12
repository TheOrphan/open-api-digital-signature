import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { VideosController } from './controllers/videos.controller';
import { VideosService } from './services/videos.service';
import { LogsModule } from 'src/logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KYC, KYCSchema } from './../utils/base/schema/kyc.schema';
import { Settings, SettingsSchema } from 'src/settings/schemas/settings.schema';
const jwt = config.get('jwt');

@Module({
  imports: [
    HttpModule,
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
      { name: KYC.name, schema: KYCSchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
