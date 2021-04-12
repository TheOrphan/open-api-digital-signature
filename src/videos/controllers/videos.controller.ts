import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { VideosDto } from '../dtos/videos.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/videos.update.dto';
// import { Contacts } from '../schemas/videos.schema';
import { VideosService } from '../services/videos.service';
import { KYC } from 'src/utils/base/schema/kyc.schema';

@ApiTags('VideosVerification')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('videosverification')
export class VideosController {
  constructor(private contactsService: VideosService) {}

  @Post('create')
  async create(
    @Body() VideosCreateDto: VideosDto,
    @Req() req,
  ): Promise<BaseResponse<KYC>> {
    return this.contactsService.create(VideosCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() ContactsUpdateDto: ContactsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<KYC>> {
    return await this.contactsService.update(ContactsUpdateDto, req);
  }
}
