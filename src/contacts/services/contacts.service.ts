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
import { ContactsCreateDto } from '../dtos/contacts.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/contacts.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
import { Contacts, ContactsDocument } from '../schemas/contacts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as config from 'config';
import dayjs = require('dayjs');
import {
  Settings,
  SettingsDocument,
} from 'src/settings/schemas/settings.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name)
    private contactsRepository: Model<ContactsDocument>,
    @InjectModel(Settings.name)
    private settingRepository: Model<SettingsDocument>,
    private logsService: LogsService,
    private httpService: HttpService,
  ) {}

  async create(createContactsDto: ContactsCreateDto, req): Promise<any> {
    // const found = await this.contactsRepository.findOne({
    //   first_name: createContactsDto.first_name,
    //   last_name: createContactsDto.last_name,
    // });
    // if (found) {
    //   throw new BadRequestException('Record already exist');
    // }
    try {
      const {
        first_name,
        last_name,
        phone,
        email,
        password,
        peruri_type,
        ktp,
        ktpPhoto,
        npwp,
        npwpPhoto,
        selfPhoto,
        address,
        city,
        province,
        gender,
        placeofBirth,
        dateofBirth,
        orgUnit,
        workUnit,
        position,
      } = createContactsDto;
      const setting = await this.settingRepository.findOne({
        key: 'peruri_token',
      });
      const KycConfig = config.get('kyc');
      const register = await this.httpService
        .post(
          KycConfig.URL +
            '/gateway/digitalSignatureFullJwtSandbox/1.0/registration/v1',
          {
            param: {
              systemId: KycConfig.SYSTEM_ID,
              name: first_name + ' ' + last_name,
              phone,
              email,
              password,
              type: peruri_type,
              ktp,
              ktpPhoto,
              npwp,
              npwpPhoto,
              selfPhoto,
              address,
              city,
              province,
              gender,
              placeofBirth,
              dateofBirth,
              orgUnit,
              workUnit,
              position,
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
      console.log(register.data);
      const contacts = new Contacts();
      Object.assign(contacts, createContactsDto);
      contacts.created_at = dayjs().format();
      const createData = new this.contactsRepository(contacts);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(result),
        module: 'contacts',
      });
      return new BaseResponse<any>(
        HttpStatus.CREATED,
        'CREATED',
        'Contact successfully created',
        register.data,
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
}
