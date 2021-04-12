import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { PaginationBuilder } from 'src/utils/base/pagination/pagination.builder';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import {
  KYC as KYCTTD,
  KYCDocument as KYCTTDDocument,
} from 'src/utils/base/schema/kyc.schema';

@Injectable()
export class KYCTTDService {
  constructor(
    @InjectModel(KYCTTD.name) private logsRepository: Model<KYCTTDDocument>,
  ) {}
}
