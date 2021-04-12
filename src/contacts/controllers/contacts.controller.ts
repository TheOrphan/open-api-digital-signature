import {
  Body,
  Controller,
  HttpStatus,
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
import { ContactsCreateDto } from '../dtos/contacts.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/contacts.update.dto';
import { Contacts } from '../schemas/contacts.schema';
import { ContactsService } from '../services/contacts.service';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}




  @Post('create')
  async create(
    @Body() ContactsCreateDto: ContactsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Contacts>> {
    return this.contactsService.create(ContactsCreateDto, req);
  }

}
