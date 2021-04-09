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
import { UsersGroupsCreateDto } from '../dtos/users-groups.create.dto';
import { UsersGroupsDto } from '../dtos/users-groups.dto';
import { UsersGroupsUpdateDto } from '../dtos/users-groups.update.dto';
import {
  UsersGroups,
  UsersGroupsDocument,
} from '../schemas/users-groups.schema';
import { LogsService } from 'src/logs/services/logs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersGroupsService {
  constructor(
    @InjectModel(UsersGroups.name)
    private usersGroupsRepository: Model<UsersGroupsDocument>,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<UsersGroups[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const usersGroups = await this.usersGroupsRepository
        .find()
        .populate({ path: 'contact_id' })
        .limit(size)
        .skip((page - 1) * size);

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(usersGroups.length)
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
      where: { _id: usersGroupsDto.id },
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
    const found = await this.usersGroupsRepository.findOne({
      where: {
        user_id: createUsersGroupsDto.user_id,
        group_id: createUsersGroupsDto.group_id,
      },
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const usersGroups = new UsersGroups();
      Object.assign(usersGroups, createUsersGroupsDto);
      const createdData = new this.usersGroupsRepository(usersGroups);
      const result = await createdData.save();
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
  ): Promise<BaseResponse<UsersGroups>> {
    const { id } = updateUsersGroupsDto;
    const found = await (await this.usersGroupsRepository.findOne({ _id: id }))
      .populate({ path: 'user_id' })
      .populate({ path: 'group_id' });
    if (!found) {
      return new BaseResponse<UsersGroups>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Users Groups with ID: ${id} not found`,
        null,
      );
    }

    try {
      const usersGroups = found;
      Object.assign(usersGroups, updateUsersGroupsDto);
      const updatedData = new this.usersGroupsRepository(usersGroups);
      const result = await updatedData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(found),
        module: 'users groups',
      });
      return new BaseResponse<UsersGroups>(
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
  ): Promise<BaseResponse<UsersGroups>> {
    const { id } = usersGroupsDto;
    const usersGroups = await this.usersGroupsRepository
      .findOne({ _id: id })
      .populate({ path: 'user_id' })
      .populate({ path: 'group_id' });
    if (!usersGroups) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Users groups not found',
        module: 'users groups',
      });
      return new BaseResponse<UsersGroups>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Users Groups not found',
        null,
      );
    }

    try {
      const result = await usersGroups.remove();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(usersGroups),
        module: 'users groups',
      });
      return new BaseResponse<UsersGroups>(
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
      const usersGroups = await this.usersGroupsRepository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(usersGroups.length)
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
