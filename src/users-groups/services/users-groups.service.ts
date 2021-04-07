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
import { UsersGroupsCreateDto } from '../dtos/users-groups.create.dto';
import { UsersGroupsDto } from '../dtos/users-groups.dto';
import { UsersGroupsUpdateDto } from '../dtos/users-groups.update.dto';
import { UsersGroups } from '../entities/users-groups.entity';
import { UsersGroupsRepository } from '../repositories/users-groups.repository';
import { LogsService } from 'src/logs/services/logs.service';

@Injectable()
export class UsersGroupsService {
  constructor(
    @InjectRepository(UsersGroupsRepository)
    private usersGroupsRepository: UsersGroupsRepository,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<UsersGroups[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const [
        usersGroups,
        total,
      ] = await this.usersGroupsRepository.findAndCount({
        relations: ['user_id', 'group_id', 'user_id.contact_id'],
        take: size,
        skip: (page - 1) * size,
        // order: orderBy
      });

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<UsersGroups[]>(
        HttpStatus.OK,
        'OK',
        null,
        usersGroups,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(
    usersGroupsDto: UsersGroupsDto,
  ): Promise<BaseResponse<UsersGroups>> {
    const usersGroups = await this.usersGroupsRepository.findOne({
      where: { id: usersGroupsDto.id },
    });
    if (!usersGroups) {
      throw new NotFoundException('Divison not found');
    }
    return new BaseResponse<UsersGroups>(
      HttpStatus.OK,
      'OK',
      'Users Groups found',
      usersGroups,
    );
  }

  async create(createUsersGroupsDto: UsersGroupsCreateDto, req): Promise<any> {
    try {
      const usersGroups = new UsersGroups();
      Object.assign(usersGroups, createUsersGroupsDto);
      const result = await usersGroups.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createUsersGroupsDto),
        module: 'users groups',
      });
      return new BaseResponse<UsersGroups>(
        HttpStatus.CREATED,
        'CREATED',
        'Users Groups successfully created',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed ',
        content: error.message,
        module: 'users groups',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateUsersGroupsDto: UsersGroupsUpdateDto,
    req,
  ): Promise<BaseResponse<UpdateResult>> {
    const { id } = updateUsersGroupsDto;
    const found = await this.usersGroupsRepository.findOne(id, {
      relations: ['user_id', 'group_id'],
    });
    if (!found) {
      return new BaseResponse<UpdateResult>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Users Groups with ID: ${id} not found`,
        null,
      );
    }

    try {
      const usersGroups = new UsersGroups();
      Object.assign(usersGroups, updateUsersGroupsDto);
      const result = await this.usersGroupsRepository.update(
        updateUsersGroupsDto.id,
        usersGroups,
      );
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(found),
        module: 'users groups',
      });
      return new BaseResponse<UpdateResult>(
        HttpStatus.CREATED,
        'UPDATED',
        'Users Groups successfully updated',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update failed',
        content: error.message,
        module: 'users groups',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async delete(
    usersGroupsDto: UsersGroupsDto,
    req,
  ): Promise<BaseResponse<DeleteResult>> {
    const { id } = usersGroupsDto;
    const usersGroups = await this.usersGroupsRepository.findOne(id, {
      relations: ['user_id', 'group_id'],
    });
    if (!usersGroups) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Users groups not found',
        module: 'users groups',
      });
      return new BaseResponse<DeleteResult>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Users Groups not found',
        null,
      );
    }

    try {
      const result = await this.usersGroupsRepository.delete(id);
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(usersGroups),
        module: 'users groups',
      });
      return new BaseResponse<DeleteResult>(
        HttpStatus.CREATED,
        'DELETED',
        'Users Groups has been deleted',
        result,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<UsersGroups[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const [
        usersGroups,
        total,
      ] = await this.usersGroupsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        order: {
          group_id: orderBy === orderBy ? -1 : 1,
        },
        where: filter,
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<UsersGroups[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        usersGroups,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
