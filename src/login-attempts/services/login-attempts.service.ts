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
import { LoginAttemptsCreateDto } from '../dtos/login-attempts.create.dto';
import { LoginAttemptsDto } from '../dtos/login-attempts.dto';
import { LoginAttemptsUpdateDto } from '../dtos/login-attempts.update.dto';
import { LoginAttempts } from '../entities/login-attempts.entity';
import { LoginAttemptsRepository } from '../repositories/login-attempts.repository';

@Injectable()
export class LoginAttemptsService {
  constructor(
    @InjectRepository(LoginAttemptsRepository)
    private loginAttemptsRepository: LoginAttemptsRepository,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<LoginAttempts[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const [
        loginAttempts,
        total,
      ] = await this.loginAttemptsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        // order: orderBy
      });

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
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
      where: { id: loginAttemptsDto.id },
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
      const result = await loginAttempts.save();
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
  ): Promise<BaseResponse<UpdateResult>> {
    const { id } = updateLoginAttemptsDto;
    const found = await this.loginAttemptsRepository.findOne({ id });
    if (!found) {
      return new BaseResponse<UpdateResult>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Divisi dengan ID: ${id} tidak ditemukan`,
        null,
      );
    }

    try {
      const loginAttempts = new LoginAttempts();
      Object.assign(loginAttempts, updateLoginAttemptsDto);
      const result = await this.loginAttemptsRepository.update(
        updateLoginAttemptsDto.id,
        loginAttempts,
      );

      return new BaseResponse<UpdateResult>(
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
  ): Promise<BaseResponse<DeleteResult>> {
    const loginAttempts = await this.loginAttemptsRepository.findOne(
      loginAttemptsDto.id,
    );
    if (!loginAttempts) {
      return new BaseResponse<DeleteResult>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'LoginAttempts not found',
        null,
      );
    }

    try {
      const result = await this.loginAttemptsRepository.delete(
        loginAttemptsDto.id,
      );
      return new BaseResponse<DeleteResult>(
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
      const [
        loginAttempts,
        total,
      ] = await this.loginAttemptsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        order: {
          time: orderBy === orderBy ? -1 : 1,
        },
        where: filter,
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
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
