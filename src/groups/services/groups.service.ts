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
import { GroupsCreateDto } from '../dtos/groups.create.dto';
import { GroupsDto } from '../dtos/groups.dto';
import { GroupsUpdateDto } from '../dtos/groups.update.dto';
import { Groups } from '../entities/groups.entity';
import { GroupsRepository } from '../repositories/groups.repository';
import { LogsService } from 'src/logs/services/logs.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsRepository)
    private groupsRepository: GroupsRepository,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Groups[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const [groups, total] = await this.groupsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        // order: orderBy
      });

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<Groups[]>(
        HttpStatus.OK,
        'OK',
        null,
        groups,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(groupsDto: GroupsDto): Promise<BaseResponse<Groups>> {
    const groups = await this.groupsRepository.findOne({
      where: { id: groupsDto.id },
    });
    if (!groups) {
      throw new NotFoundException('Group not found');
    }
    return new BaseResponse<Groups>(
      HttpStatus.OK,
      'OK',
      'Groups found',
      groups,
    );
  }

  async create(createGroupsDto: GroupsCreateDto, req): Promise<any> {
    const found = await this.groupsRepository.findOne({
      where: {
        name: createGroupsDto.name,
      },
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const groups = new Groups();
      Object.assign(groups, createGroupsDto);
      const result = await groups.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createGroupsDto),
        module: 'groups',
      });
      return new BaseResponse<Groups>(
        HttpStatus.CREATED,
        'CREATED',
        'Group successfully created',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed',
        content: error.message,
        module: 'groups',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateGroupsDto: GroupsUpdateDto,
    req,
  ): Promise<BaseResponse<UpdateResult>> {
    const { id } = updateGroupsDto;
    const found = await this.groupsRepository.findOne({ id });
    if (!found) {
      return new BaseResponse<UpdateResult>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Group with ID: ${id} not found`,
        null,
      );
    }
    try {
      const groups = new Groups();
      Object.assign(groups, updateGroupsDto);
      const result = await this.groupsRepository.update(
        updateGroupsDto.id,
        groups,
      );
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateGroupsDto),
        module: 'groups',
      });
      return new BaseResponse<UpdateResult>(
        HttpStatus.CREATED,
        'UPDATED',
        'Group successfully updated',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update failed',
        content: error.message,
        module: 'groups',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async delete(groupsDto: GroupsDto, req): Promise<BaseResponse<DeleteResult>> {
    const groups = await this.groupsRepository.findOne(groupsDto.id);
    if (!groups) {
      return new BaseResponse<DeleteResult>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Groups not found',
        null,
      );
    }

    try {
      const result = await this.groupsRepository.delete(groupsDto.id);
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(groups),
        module: 'groups',
      });
      return new BaseResponse<DeleteResult>(
        HttpStatus.CREATED,
        'DELETED',
        'Groups has been deleted',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: error.message,
        module: 'groups',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Groups[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const [groups, total] = await this.groupsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        order: {
          name: orderBy === orderBy ? -1 : 1,
        },
        where: filter,
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<Groups[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        groups,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
