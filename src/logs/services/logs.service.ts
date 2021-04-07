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
import { LogsCreateDto } from '../dtos/logs.create.dto';
import { LogsDto } from '../dtos/logs.dto';
import { LogsUpdateDto } from '../dtos/logs.update.dto';
import { Logs } from '../entities/logs.entity';
import { LogsRepository } from '../repositories/logs.repository';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogsRepository)
    private logsRepository: LogsRepository,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Logs[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const [logs, total] = await this.logsRepository.findAndCount({
        relations: ['user_id', 'user_id.contact_id'],
        take: size,
        skip: (page - 1) * size,
        order: { created_at: 'DESC' },
      });

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<Logs[]>(
        HttpStatus.OK,
        'OK',
        null,
        logs,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(logsDto: LogsDto): Promise<BaseResponse<Logs>> {
    const logs = await this.logsRepository.findOne({
      where: { id: logsDto.id },
    });
    if (!logs) {
      throw new NotFoundException('Divison not found');
    }
    return new BaseResponse<Logs>(HttpStatus.OK, 'OK', 'Logs found', logs);
  }

  async create(createLogsDto: LogsCreateDto): Promise<any> {
    try {
      const logs = new Logs();
      Object.assign(logs, createLogsDto);
      const result = await logs.save();
      return new BaseResponse<Logs>(
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
    updateLogsDto: LogsUpdateDto,
  ): Promise<BaseResponse<UpdateResult>> {
    const { id } = updateLogsDto;
    const found = await this.logsRepository.findOne({ id });
    if (!found) {
      return new BaseResponse<UpdateResult>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Divisi dengan ID: ${id} tidak ditemukan`,
        null,
      );
    }

    try {
      const logs = new Logs();
      Object.assign(logs, updateLogsDto);
      const result = await this.logsRepository.update(updateLogsDto.id, logs);

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

  async delete(logsDto: LogsDto): Promise<BaseResponse<DeleteResult>> {
    const logs = await this.logsRepository.findOne(logsDto.id);
    if (!logs) {
      return new BaseResponse<DeleteResult>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Logs not found',
        null,
      );
    }

    try {
      const result = await this.logsRepository.delete(logsDto.id);
      return new BaseResponse<DeleteResult>(
        HttpStatus.CREATED,
        'DELETED',
        'Logs has been deleted',
        result,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Logs[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const [logs, total] = await this.logsRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        order: {
          created_at: orderBy === orderBy ? -1 : 1,
        },
        where: filter,
      });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(total)
        .build();

      return new BaseResponse<Logs[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        logs,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
