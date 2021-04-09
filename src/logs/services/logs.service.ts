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
import { LogsCreateDto } from '../dtos/logs.create.dto';
import { LogsDto } from '../dtos/logs.dto';
import { LogsUpdateDto } from '../dtos/logs.update.dto';
import { Logs, LogsDocument } from '../schemas/logs.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Logs.name) private logsRepository: Model<LogsDocument>,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Logs[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const logs = await this.logsRepository
        .find()
        .populate({ path: 'user_id', populate: { path: 'contact_id' } })
        .limit(size)
        .skip((page - 1) * size)
        .sort({ created_at: -1 });

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(logs.length)
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
      where: { _id: logsDto.id },
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
      logs.created_at = dayjs().format();
      const createdData = new this.logsRepository(logs);
      const result = await createdData.save();
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

  async update(updateLogsDto: LogsUpdateDto): Promise<BaseResponse<Logs>> {
    const { id } = updateLogsDto;
    const found = await this.logsRepository.findOne({ _id: id });
    if (!found) {
      return new BaseResponse<Logs>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Divisi dengan ID: ${id} tidak ditemukan`,
        null,
      );
    }

    try {
      const logs = found;
      Object.assign(logs, updateLogsDto);
      const updatedData = new this.logsRepository(logs);
      const result = await updatedData.save();

      return new BaseResponse<Logs>(
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

  async delete(logsDto: LogsDto): Promise<BaseResponse<Logs>> {
    const logs = await this.logsRepository.findOne({ _id: logsDto.id });
    if (!logs) {
      return new BaseResponse<Logs>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Logs not found',
        null,
      );
    }

    try {
      const result = await logs.remove();
      return new BaseResponse<Logs>(
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
      const logs = await this.logsRepository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(logs.length)
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
