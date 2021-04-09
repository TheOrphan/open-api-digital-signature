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
import { ContactsCreateDto } from '../dtos/contacts.create.dto';
import { ContactsDto } from '../dtos/contacts.dto';
import { ContactsUpdateDto } from '../dtos/contacts.update.dto';
// import { ContactsRepository } from '../repositories/contacts.repository';
import { LogsService } from 'src/logs/services/logs.service';
import { Contacts, ContactsDocument } from '../schemas/contacts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private contactsModel: Model<ContactsDocument>,
  ) {}

  async create(createDto: ContactsCreateDto): Promise<Contacts> {
    const create = new this.contactsModel(createDto);
    return create.save();
  }

  // async getAllData(
  //   getAllDataDto: GetAllDataDto,
  // ): Promise<BaseResponse<Contacts[]>> {
  //   const { size, where, page, orderBy } = getAllDataDto;

  //   try {
  //     const [contacts, total] = await this.contactsRepository.findAndCount({
  //       where,
  //       take: size,
  //       skip: (page - 1) * size,
  //       // order: orderBy
  //     });

  //     const pagination = new PaginationBuilder()
  //       .page(page)
  //       .size(size)
  //       .totalContent(total)
  //       .build();

  //     return new BaseResponse<Contacts[]>(
  //       HttpStatus.OK,
  //       'OK',
  //       null,
  //       contacts,
  //       pagination,
  //     );
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
  //     );
  //   }
  // }

  // async getById(contactsDto: ContactsDto): Promise<BaseResponse<Contacts>> {
  //   const contacts = await this.contactsRepository.findOne({
  //     where: { id: contactsDto.id },
  //   });
  //   if (!contacts) {
  //     throw new NotFoundException('Contact not found');
  //   }
  //   return new BaseResponse<Contacts>(
  //     HttpStatus.OK,
  //     'OK',
  //     'Contact found',
  //     contacts,
  //   );
  // }

  // async create(createContactsDto: ContactsCreateDto, req): Promise<any> {
  //   const found = await this.contactsRepository.findOne({
  //     where: {
  //       first_name: createContactsDto.first_name,
  //       last_name: createContactsDto.last_name,
  //     },
  //   });
  //   if (found) {
  //     throw new BadRequestException('Record already exist');
  //   }
  //   try {
  //     const contacts = new Contacts();
  //     Object.assign(contacts, createContactsDto);
  //     const result = await contacts.save();
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'create success',
  //       content: JSON.stringify(createContactsDto),
  //       module: 'contacts',
  //     });
  //     return new BaseResponse<Contacts>(
  //       HttpStatus.CREATED,
  //       'CREATED',
  //       'Contact successfully created',
  //       result,
  //     );
  //   } catch (error) {
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'create failed',
  //       content: error.message,
  //       module: 'contacts',
  //     });
  //     throw new BadRequestException(
  //       `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
  //     );
  //   }
  // }

  // async update(
  //   updateContactsDto: ContactsUpdateDto,
  //   req,
  // ): Promise<BaseResponse<UpdateResult>> {
  //   const { id } = updateContactsDto;
  //   const found = await this.contactsRepository.findOne({ id });
  //   if (!found) {
  //     return new BaseResponse<UpdateResult>(
  //       HttpStatus.NOT_FOUND,
  //       'ERROR',
  //       `Contact with ID: ${id} not found`,
  //       null,
  //     );
  //   }

  //   try {
  //     const contacts = new Contacts();
  //     Object.assign(contacts, updateContactsDto);
  //     const result = await this.contactsRepository.update(
  //       updateContactsDto.id,
  //       contacts,
  //     );
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'update success',
  //       content: JSON.stringify(updateContactsDto),
  //       module: 'contacts',
  //     });
  //     return new BaseResponse<UpdateResult>(
  //       HttpStatus.CREATED,
  //       'UPDATED',
  //       'Contact successfully updated',
  //       result,
  //     );
  //   } catch (error) {
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'update failed',
  //       content: error.message,
  //       module: 'contacts',
  //     });
  //     throw new BadRequestException(
  //       `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
  //     );
  //   }
  // }

  // async delete(
  //   contactsDto: ContactsDto,
  //   req,
  // ): Promise<BaseResponse<DeleteResult>> {
  //   const contacts = await this.contactsRepository.findOne(contactsDto.id);
  //   if (!contacts) {
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'delete failed',
  //       content: 'Contact not found',
  //       module: 'contacts',
  //     });
  //     return new BaseResponse<DeleteResult>(
  //       HttpStatus.NOT_FOUND,
  //       'NOT FOUND',
  //       'Contact not found',
  //       null,
  //     );
  //   }
  //   try {
  //     const result = await this.contactsRepository.delete(contactsDto.id);
  //     const { created_at, updated_at, ...rest } = contacts;
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'delete success',
  //       content: JSON.stringify(rest),
  //       module: 'contacts',
  //     });
  //     return new BaseResponse<DeleteResult>(
  //       HttpStatus.CREATED,
  //       'DELETED',
  //       'Contact has been deleted',
  //       result,
  //     );
  //   } catch (error) {
  //     this.logsService.create({
  //       user_id: req.user.id,
  //       activity: 'delete failed',
  //       content: error.message,
  //       module: 'contacts',
  //     });
  //     throw new BadRequestException(
  //       `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
  //     );
  //   }
  // }

  // async filter(filterDto: FilterDto): Promise<BaseResponse<Contacts[]>> {
  //   const { page, size, orderBy, filter } = filterDto;
  //   try {
  //     const [contacts, total] = await this.contactsRepository.findAndCount({
  //       take: size,
  //       skip: (page - 1) * size,
  //       order: {
  //         created_at: orderBy === orderBy ? -1 : 1,
  //       },
  //       where: filter,
  //     });
  //     const pagination = new PaginationBuilder()
  //       .page(page)
  //       .size(size)
  //       .totalContent(total)
  //       .build();

  //     return new BaseResponse<Contacts[]>(
  //       HttpStatus.OK,
  //       'FIND ALL',
  //       null,
  //       contacts,
  //       pagination,
  //     );
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
  //     );
  //   }
  // }
}
