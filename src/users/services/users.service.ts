import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { PaginationBuilder } from 'src/utils/base/pagination/pagination.builder';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { UsersCreateDto } from '../dtos/users.create.dto';
import { UsersDto } from '../dtos/users.dto';
import { UsersUpdateDto } from '../dtos/users.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
import { Users, UsersDocument } from '../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersRepository: Model<UsersDocument>,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Users[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const users = await this.usersRepository
        .find()
        .populate({ path: 'contact_id' })
        .limit(size)
        .skip((page - 1) * size);
      const total = users.length;
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<Users[]>(
        HttpStatus.OK,
        'OK',
        null,
        users,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(usersDto: UsersDto): Promise<BaseResponse<Users>> {
    const users = await this.usersRepository.findOne({
      where: { _id: usersDto.id },
    });
    if (!users) {
      throw new NotFoundException('Divison not found');
    }
    return new BaseResponse<Users>(HttpStatus.OK, 'OK', 'Users found', users);
  }

  async create(
    createUsersDto: UsersCreateDto,
    req,
  ): Promise<BaseResponse<Users>> {
    const { password } = createUsersDto;
    const found = await this.usersRepository.findOne({
      where: {
        email: createUsersDto.email,
      },
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const hashed = await this.hashPassword(password || '12345678');
      const users = new Users();
      Object.assign(users, createUsersDto);
      users.password = hashed;
      users.created_at = dayjs().format();
      const createdData = new this.usersRepository(users);
      const result = await createdData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createUsersDto),
        module: 'users',
      });
      return new BaseResponse<Users>(
        HttpStatus.CREATED,
        'CREATED',
        'User successfully created',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed',
        content: error.message,
        module: 'users',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateUsersDto: UsersUpdateDto,
    req,
  ): Promise<BaseResponse<Users>> {
    const { password, id, quota_limit, active, email } = updateUsersDto;
    const found = await this.usersRepository.findOne({ _id: id });
    if (!found) {
      return new BaseResponse<Users>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `User with ID: ${id} not found`,
        null,
      );
    }
    try {
      const users = found;
      Object.assign(users, updateUsersDto);
      if (password) {
        const hashed = await this.hashPassword(password);
        users.password = hashed;
      }
      users.updated_at = dayjs().format();
      const updatedData = new this.usersRepository(users);
      const result = await updatedData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: quota_limit
          ? 'update quota success'
          : password
          ? 'update password success'
          : email
          ? 'update success'
          : 'deactivate user success',
        content: JSON.stringify(updateUsersDto),
        module: 'users',
      });
      return new BaseResponse<Users>(
        HttpStatus.CREATED,
        'UPDATED',
        `User with ID: ${id} successfully updated`,
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: quota_limit
          ? 'update quota failed'
          : password
          ? 'update password failed'
          : email
          ? 'update failed'
          : 'deactivate user failed',
        content: error.message,
        module: 'users',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async delete(usersDto: UsersDto, req): Promise<BaseResponse<Users>> {
    const users = await this.usersRepository.findOne({ _id: usersDto.id });
    if (!users) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Users not found',
        module: 'users',
      });
      return new BaseResponse<Users>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Users not found',
        null,
      );
    }

    try {
      const result = await users.remove();
      const { created_at, ...rest } = users;
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(rest),
        module: 'users',
      });
      return new BaseResponse<Users>(
        HttpStatus.CREATED,
        'DELETED',
        'Users has been deleted',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: error.message,
        module: 'users',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Users[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const users = await this.usersRepository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(users.length)
        .build();

      return new BaseResponse<Users[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        users,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
