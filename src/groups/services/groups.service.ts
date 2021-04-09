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
import { GroupsCreateDto } from '../dtos/groups.create.dto';
import { GroupsDto } from '../dtos/groups.dto';
import { GroupsUpdateDto } from '../dtos/groups.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Groups, GroupsDocument } from '../schemas/groups.schema';
import { Model } from 'mongoose';
import dayjs = require('dayjs');

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups.name) private groupsRespository: Model<GroupsDocument>,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Groups[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      // const [groups, total] = await this.groupsRespository.findAndCount({
      //   take: size,
      //   skip: (page - 1) * size,
      //   // order: orderBy
      // });

      const groups = await this.groupsRespository
        .find()
        .limit(size)
        .skip(page - 1 * size);

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(groups.length)
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
    const groups = await this.groupsRespository.findOne({
      _id: groupsDto.id,
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
    const found = await this.groupsRespository.find({
      name: createGroupsDto.name,
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const groups = new Groups();
      Object.assign(groups, createGroupsDto);
      const createData = new this.groupsRespository(groups);
      groups.created_at = dayjs().format();
      const result = await createData.save();
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
  ): Promise<BaseResponse<Groups>> {
    const { id } = updateGroupsDto;
    const found = await this.groupsRespository.findOne({ _id: id });
    if (!found) {
      return new BaseResponse<Groups>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Group with ID: ${id} not found`,
        null,
      );
    }
    try {
      const groups = found;
      Object.assign(groups, updateGroupsDto);
      // const result = await this.gro.update(
      //   updateGroupsDto.id,
      //   groups,
      // );
      groups.updated_at = dayjs().format();
      const createData = new this.groupsRespository(groups);
      const result = await createData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateGroupsDto),
        module: 'groups',
      });
      return new BaseResponse<Groups>(
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

  async delete(groupsDto: GroupsDto, req): Promise<BaseResponse<Groups>> {
    const groups = await this.groupsRespository.findOne({ _id: groupsDto.id });
    if (!groups) {
      return new BaseResponse<Groups>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Groups not found',
        null,
      );
    }

    try {
      const result = await groups.remove();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(groups),
        module: 'groups',
      });
      return new BaseResponse<Groups>(
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
      const groups = await this.groupsRespository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(groups.length)
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
