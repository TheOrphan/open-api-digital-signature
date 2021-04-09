import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { PaginationBuilder } from 'src/utils/base/pagination/pagination.builder';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ContactsCreateDto } from 'src/contacts/dtos/contacts.create.dto';
import { ContactsDto } from 'src/contacts/dtos/contacts.dto';
import { ContactsUpdateDto } from 'src/contacts/dtos/contacts.update.dto';
import { ContactsRepository } from 'src/contacts/repositories/contacts.repository';
import { LogsService } from 'src/logs/services/logs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Contacts, ContactsDocument } from 'src/contacts/schemas/contacts.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Contacts.name) private contactRespository: Model<ContactsDocument>,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Contacts[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      // const contacts = await this.contactRespository.find({
      //   where: { type: 'company' },
      //   take: size,
      //   skip: (page - 1) * size,
      //   // order: orderBy
      // });
      const contacts = await this.contactRespository.find({type: 'company'}).limit(size).skip(page - 1 * size);

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(contacts.length)
        .build();

      return new BaseResponse<Contacts[]>(
        HttpStatus.OK,
        'OK',
        null,
        contacts,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(companiesDto: ContactsDto): Promise<BaseResponse<Contacts>> {
    // const company = await this.contactRespository.findOne({
    //   where: { id: companiesDto.id, type: 'company' },
    // });
    const company = await this.contactRespository.findOne({
      _id: companiesDto.id,
      type: 'company'
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return new BaseResponse<Contacts>(
      HttpStatus.OK,
      'OK',
      'Company found',
      company,
    );
  }

  async create(createContactsDto: ContactsCreateDto, req): Promise<any> {
    // const found = await this.contactsRepository.findOne({
    //   where: {
    //     first_name: createContactsDto.first_name,
    //     last_name: createContactsDto.last_name,
    //     type: 'company',
    //   },
    // });
    const found = await this.contactRespository.findOne({
      first_name: createContactsDto.first_name,
      last_name: createContactsDto.last_name,
      type: 'company'
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const contacts = new Contacts();
      Object.assign(contacts, createContactsDto);
      const createData = new this.contactRespository(contacts);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createContactsDto),
        module: 'companies',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.CREATED,
        'CREATED',
        'Company successfully created',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed ',
        content: error.message,
        module: 'companies',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateContactsDto: ContactsUpdateDto,
    req,
  ): Promise<BaseResponse<Contacts>> {
    const { id } = updateContactsDto;
    const found = await this.contactRespository.findOne({ _id:id });
    if (!found) {
      return new BaseResponse<Contacts>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Company with ID: ${id} not found`,
        null,
      );
    }

    try {
      const companies = found;
      Object.assign(companies, updateContactsDto);
      // const result = await this.contactsRepository.update(
      //   updateContactsDto.id,
      //   companies,
      // );
      const createData = new this.contactRespository(companies);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateContactsDto),
        module: 'companies',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.CREATED,
        'UPDATED',
        'Company successfully updated',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update failed',
        content: error.message,
        module: 'companies',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async delete(
    companiesDto: ContactsDto,
    req,
  ): Promise<BaseResponse<Contacts>> {
    const companies = await this.contactRespository.findOne({_id:companiesDto.id});
    if (!companies) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Company not found',
        module: 'companies',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Company not found',
        null,
      );
    }

    try {
      const result = await companies.remove();
      const { created_at, updated_at, ...rest } = companies;
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(rest),
        module: 'companies',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.CREATED,
        'DELETED',
        'Company has been deleted',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: error.message,
        module: 'companies',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Contacts[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const companies = await this.contactRespository.find({
        take: size,
        skip: (page - 1) * size,
        order: {
          created_at: orderBy === orderBy ? -1 : 1,
        },
        where: { ...filter, type: 'company' },
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(companies.length)
        .build();

      return new BaseResponse<Contacts[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        companies,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
