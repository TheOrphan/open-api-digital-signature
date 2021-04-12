import {
  BadRequestException,
  HttpService,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import {
  KYC as KYCTTD,
  KYCDocument as KYCTTDDocument,
} from 'src/utils/base/schema/kyc.schema';
import { LogsService } from 'src/logs/services/logs.service';
import { KycSpecimentDto } from '../dtos/kyc-ttd.create.dto';
import * as config from 'config';
import {
  Settings,
  SettingsDocument,
} from 'src/settings/schemas/settings.schema';

@Injectable()
export class KYCTTDService {
  constructor(
    @InjectModel(KYCTTD.name) private kycttdRepository: Model<KYCTTDDocument>,
    @InjectModel(Settings.name)
    private settingsRepository: Model<SettingsDocument>,
    private httpService: HttpService,
    private logsService: LogsService,
  ) {}

  async sendSpeciment(
    kycSpecimentDto: KycSpecimentDto,
    req,
  ): Promise<BaseResponse<any>> {
    const { speciment } = kycSpecimentDto;
    try {
      const peruriToken = await this.settingsRepository.findOne({
        key: 'peruri_token',
      });
      const kycConfig = config.get('kyc');
      const sendingSpeciment = await this.httpService
        .post(
          kycConfig.URL + '/gateway/jwtSandbox/1.0/getJsonWebToken/v1',
          {
            param: {
              email: req.user.email,
              systemId: kycConfig.SYSTEM_ID,
              speciment,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-Gateway-APIKey': kycConfig.API_KEY,
              Authorization: 'Bearer ' + peruriToken.value,
            },
          },
        )
        .toPromise();

      this.logsService.create({
        user_id: req.user.id,
        activity: 'success',
        content: req.ip,
        module: 'login',
      });
      return new BaseResponse<any>(
        HttpStatus.ACCEPTED,
        'SUCCESS',
        'Settings found',
        {},
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'failed',
        content: error.message + ' with ip : ' + req.ip,
        module: 'login',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
