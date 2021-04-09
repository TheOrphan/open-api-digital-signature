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
import { ContactsCreateDto } from '../dtos/contacts.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/contacts.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
import { Contacts, ContactsDocument } from '../schemas/contacts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs = require('dayjs');

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private contactsRepository: Model<ContactsDocument>,
    private logsService: LogsService,
  ) {}

  // async create(createDto: ContactsCreateDto): Promise<Contacts> {
  //   const create = new this.contactsModel(createDto);
  //   return create.save();
  // }

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Contacts[]>> {
    const { size, where, page, orderBy } = getAllDataDto;

    try {
      // const contacts = await this.contactsRepository.find({
      //   where,
      //   take: size,
      //   skip: (page - 1) * size,
      //   // order: orderBy
      // });

      const contacts = await this.contactsRepository.find().limit(size).skip(page - 1 * size);

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

  async getById(contactsDto: ContactsDto): Promise<BaseResponse<Contacts>> {
    const contacts = await this.contactsRepository.findOne({
      _id: contactsDto.id,
    });
    if (!contacts) {
      throw new NotFoundException('Contact not found');
    }
    return new BaseResponse<Contacts>(
      HttpStatus.OK,
      'OK',
      'Contact found',
      contacts,
    );
  }

  async create(createContactsDto: ContactsCreateDto, req): Promise<any> {
    const found = await this.contactsRepository.findOne({
    
      first_name: createContactsDto.first_name,
      last_name: createContactsDto.last_name,
    
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const contacts = new Contacts();
      Object.assign(contacts, createContactsDto);
      contacts.created_at = dayjs().format();
      const createData = new this.contactsRepository(contacts);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createContactsDto),
        module: 'contacts',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.CREATED,
        'CREATED',
        'Contact successfully created',
        result,
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
  ): Promise<BaseResponse<Contacts>> {
    const { id } = updateContactsDto;
    const found = await this.contactsRepository.findOne({ _id:id });
    if (!found) {
      return new BaseResponse<Contacts>(
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
      const createData = new this.contactsRepository(contacts);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateContactsDto),
        module: 'contacts',
      });
      return new BaseResponse<Contacts>(
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

  async delete(
    contactsDto: ContactsDto,
    req,
  ): Promise<BaseResponse<Contacts>> {
    const contacts = await this.contactsRepository.findOne({_id:contactsDto.id});
    if (!contacts) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Contact not found',
        module: 'contacts',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Contact not found',
        null,
      );
    }
    try {
      const result = await contacts.remove();
      const { created_at, updated_at, ...rest } = contacts;
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(rest),
        module: 'contacts',
      });
      return new BaseResponse<Contacts>(
        HttpStatus.CREATED,
        'DELETED',
        'Contact has been deleted',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: error.message,
        module: 'contacts',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Contacts[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const contacts = await this.contactsRepository.find({ filter })
      .limit(size)
      .skip((page - 1) * size)
      .sort({
        created_at: orderBy === orderBy ? -1 : 1,
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(contacts.length)
        .build();

      return new BaseResponse<Contacts[]>(
        HttpStatus.OK,
        'FIND ALL',
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
}
