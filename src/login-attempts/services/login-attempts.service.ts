import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { PaginationBuilder } from 'src/utils/base/pagination/pagination.builder';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { LoginAttemptsCreateDto } from '../dtos/login-attempts.create.dto';
import { LoginAttemptsDto } from '../dtos/login-attempts.dto';
import { LoginAttemptsUpdateDto } from '../dtos/login-attempts.update.dto';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from '../schemas/login-attempts.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class LoginAttemptsService {
  constructor(
    @InjectModel(LoginAttempts.name)
    private loginAttemptsRepository: Model<LoginAttemptsDocument>,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<LoginAttempts[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const loginAttempts = await this.loginAttemptsRepository
        .find()
        .limit(size)
        .skip((page - 1) * size);

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(loginAttempts.length)
        .build();

      return new BaseResponse<LoginAttempts[]>(
        HttpStatus.OK,
        'OK',
        null,
        loginAttempts,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(
    loginAttemptsDto: LoginAttemptsDto,
  ): Promise<BaseResponse<LoginAttempts>> {
    const loginAttempts = await this.loginAttemptsRepository.findOne({
      where: { _id: loginAttemptsDto.id },
    });
    if (!loginAttempts) {
      throw new NotFoundException('Divison not found');
    }
    return new BaseResponse<LoginAttempts>(
      HttpStatus.OK,
      'OK',
      'LoginAttempts found',
      loginAttempts,
    );
  }

  async create(createLoginAttemptsDto: LoginAttemptsCreateDto): Promise<any> {
    try {
      const loginAttempts = new LoginAttempts();
      Object.assign(loginAttempts, createLoginAttemptsDto);
      loginAttempts.created_at = dayjs().format();
      const createdData = new this.loginAttemptsRepository(loginAttempts);
      const result = await createdData.save();
      return new BaseResponse<LoginAttempts>(
        HttpStatus.CREATED,
        'CREATED',
        'Divisi berhasil dibuat',
        result,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateLoginAttemptsDto: LoginAttemptsUpdateDto,
  ): Promise<BaseResponse<LoginAttempts>> {
    const { id } = updateLoginAttemptsDto;
    const found = await this.loginAttemptsRepository.findOne({ id });
    if (!found) {
      return new BaseResponse<LoginAttempts>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Divisi dengan ID: ${id} tidak ditemukan`,
        null,
      );
    }

    try {
      const loginAttempts = found;
      Object.assign(loginAttempts, updateLoginAttemptsDto);
      loginAttempts.updated_at = dayjs().format();
      const updatedData = new this.loginAttemptsRepository(loginAttempts);
      const result = await updatedData.save();

      return new BaseResponse<LoginAttempts>(
        HttpStatus.CREATED,
        'UPDATED',
        'Data Divisi berhasil diupdate',
        result,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async delete(
    loginAttemptsDto: LoginAttemptsDto,
  ): Promise<BaseResponse<LoginAttempts>> {
    const loginAttempts = await this.loginAttemptsRepository.findOne({
      _id: loginAttemptsDto.id,
    });
    if (!loginAttempts) {
      return new BaseResponse<LoginAttempts>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'LoginAttempts not found',
        null,
      );
    }

    try {
      const result = await loginAttempts.remove();
      return new BaseResponse<LoginAttempts>(
        HttpStatus.CREATED,
        'DELETED',
        'LoginAttempts has been deleted',
        result,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<LoginAttempts[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const loginAttempts = await this.loginAttemptsRepository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(loginAttempts.length)
        .build();

      return new BaseResponse<LoginAttempts[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        loginAttempts,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
