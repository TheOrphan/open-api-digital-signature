import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { ContactsCreateDto } from 'src/contacts/dtos/contacts.create.dto';
import { ContactsDto } from 'src/contacts/dtos/contacts.dto';
import { ContactsUpdateDto } from 'src/contacts/dtos/contacts.update.dto';
import { CompaniesService } from '../services/companies.service';
import { Contacts } from 'src/contacts/schemas/contacts.schema';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Contacts[]>> {
    return this.companiesService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(
    @Body() companiesDto: ContactsDto,
  ): Promise<BaseResponse<Contacts>> {
    return this.companiesService.getById(companiesDto);
  }

  @Post('create')
  async create(
    @Body() ContactsCreateDto: ContactsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Contacts>> {
    return this.companiesService.create(ContactsCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() ContactsUpdateDto: ContactsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.companiesService.update(ContactsUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() companiesDto: ContactsDto,
    @Req() req,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.companiesService.delete(companiesDto, req);
  }

  @Post('get-filter')
  async filter(
    @Body() filterDto: FilterDto,
  ): Promise<BaseResponse<Contacts[]>> {
    return this.companiesService.filter(filterDto);
  }
}
