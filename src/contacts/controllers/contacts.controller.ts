import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ContactsCreateDto } from '../dtos/contacts.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/contacts.update.dto';
import { Contacts } from '../entities/contacts.entity';
import { ContactsService } from '../services/contacts.service';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Contacts[]>> {
    return this.contactsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(
    @Body() contactsDto: ContactsDto,
  ): Promise<BaseResponse<Contacts>> {
    return this.contactsService.getById(contactsDto);
  }

  @Post('create')
  async create(
    @Body() ContactsCreateDto: ContactsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Contacts>> {
    return this.contactsService.create(ContactsCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() ContactsUpdateDto: ContactsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.contactsService.update(ContactsUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() contactsDto: ContactsDto,
    @Req() req,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.contactsService.delete(contactsDto, req);
  }

  @Post('get-filter')
  async filter(
    @Body() filterDto: FilterDto,
  ): Promise<BaseResponse<Contacts[]>> {
    return this.contactsService.filter(filterDto);
  }
}
