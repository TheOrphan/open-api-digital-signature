import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

import { KYCTTDController } from './controllers/kyc-ttd.controller';
import { KYCTTDService } from './services/kyc-ttd.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  KYC as KYCTTD,
  KYCSchema as KYCTTDSchema,
} from 'src/utils/base/schema/kyc.schema';

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
    MongooseModule.forFeature([{ name: KYCTTD.name, schema: KYCTTDSchema }]),
  ],
  exports: [KYCTTDService],
  controllers: [KYCTTDController],
  providers: [KYCTTDService],
})
export class KYCTTDModule {}
