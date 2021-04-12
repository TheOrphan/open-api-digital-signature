import {
  BadRequestException,
  HttpService,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { PaginationBuilder } from 'src/utils/base/pagination/pagination.builder';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { VideosDto } from '../dtos/videos.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/videos.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
// import { Contacts, ContactsDocument } from '../schemas/videos.schema';
import { KYC, KYCDocument } from '../../utils/base/schema/kyc.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs = require('dayjs');
import * as config from 'config';
import { SettingsService } from 'src/settings/services/settings.service';
import {
  Settings,
  SettingsDocument,
} from 'src/settings/schemas/settings.schema';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(KYC.name)
    private kycsRepository: Model<KYCDocument>,
    @InjectModel(Settings.name)
    private settingRepository: Model<SettingsDocument>,
    private logsService: LogsService,
    private httpService: HttpService,
  ) {}

  // async videoVerify(createvideosDto: VideosDto,req):

  async create(createvideosDto: VideosDto, req): Promise<any> {
    const found = await this.kycsRepository.findOne();
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const setting = await this.settingRepository.findOne({
        key: 'peruri_token',
      });
      const { videoStream } = createvideosDto;
      const KycConfig = config.get('kyc');
      const user = await this.kycsRepository.findOne({user_id: req.user.id});
        const videoperuri = await this.httpService
          .post(
            KycConfig.URL +
              '/gateway/digitalSignatureFullJwtSandbox/1.0/videoVerification/v1',
            {
              param: {
                systemId: KycConfig.SYSTEM_ID,
                email: req.user.email,
                videoStream,
              },
            },
            {
              headers: {
                post: {
                  'Content-Type': 'application/json',
                  'x-Gateway-APIKey': KycConfig.API_KEY,
                  Authorization: 'Bearer ' + setting.value,
                },
              },
            },
          )
          .toPromise();
        const kycs = new KYC();
        Object.assign(kycs, createvideosDto);
        kycs.user_id = req.user.id;
        kycs.created_at = dayjs().format();
        const createData = new this.kycsRepository(kycs);
        const result = await createData.save();
        this.logsService.create({
          user_id: req.user.id,
          activity: 'create success',
          content: JSON.stringify(createvideosDto),
          module: 'contacts',
        });
        return new BaseResponse<KYC>(
          HttpStatus.CREATED,
          'CREATED',
          'Video successfully created',
        );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed',
        content: error.message,
        module: 'contacts',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateContactsDto: ContactsUpdateDto,
    req,
  ): Promise<BaseResponse<KYC>> {
    const { id } = updateContactsDto;
    const found = await this.kycsRepository.findOne({ _id: id });
    if (!found) {
      return new BaseResponse<KYC>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Contact with ID: ${id} not found`,
        null,
      );
    }

    try {
      const contacts = found;
      Object.assign(contacts, updateContactsDto);
      // const result = await this.contactsRepository.update(
      //   updateContactsDto.id,
      //   contacts,
      // );
      contacts.updated_at = dayjs().format();
      const createData = new this.kycsRepository(contacts);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateContactsDto),
        module: 'contacts',
      });
      return new BaseResponse<KYC>(
        HttpStatus.CREATED,
        'UPDATED',
        'Contact successfully updated',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update failed',
        content: error.message,
        module: 'contacts',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
