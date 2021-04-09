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
import { SettingsCreateDto } from '../dtos/settings.create.dto';
import { SettingsDto } from '../dtos/settings.dto';
import { SettingsUpdateDto } from '../dtos/settings.update.dto';
import { LogsService } from 'src/logs/services/logs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { Settings, SettingsDocument } from '../schemas/settings.schema';
import { settings } from 'cluster';
@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private settingsRepository: Model<SettingsDocument>,
    private logsService: LogsService,
  ) {}

  async getAllData(
    getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Settings[]>> {
    const { size, page, orderBy } = getAllDataDto;
    try {
      const settings = await this.settingsRepository.find();

      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(settings.length)
        .build();

      return new BaseResponse<Settings[]>(
        HttpStatus.OK,
        'OK',
        null,
        settings,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async getById(settingsDto: SettingsDto): Promise<BaseResponse<Settings>> {
    const settings = await this.settingsRepository.findOne({
      where: { _id: settingsDto.id },
    });
    if (!settings) {
      throw new NotFoundException('Divison not found');
    }
    return new BaseResponse<Settings>(
      HttpStatus.OK,
      'OK',
      'Settings found',
      settings,
    );
  }

  async create(createSettingsDto: SettingsCreateDto, req): Promise<any> {
    const found = await this.settingsRepository.findOne({
      where: {
        key: createSettingsDto.key,
      },
    });
    if (found) {
      throw new BadRequestException('Record already exist');
    }
    try {
      const settings = new Settings();
      Object.assign(settings, createSettingsDto);
      const createdData = new this.settingsRepository(settings);
      const result = await createdData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create success',
        content: JSON.stringify(createSettingsDto),
        module: 'settings',
      });
      return new BaseResponse<Settings>(
        HttpStatus.CREATED,
        'CREATED',
        'Settings successfully created',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'create failed ',
        content: error.message,
        module: 'settings',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async update(
    updateSettingsDto: SettingsUpdateDto,
    req,
  ): Promise<BaseResponse<Settings>> {
    const { id } = updateSettingsDto;
    const found = await this.settingsRepository.findOne({ _id: id });
    if (!found) {
      return new BaseResponse<Settings>(
        HttpStatus.NOT_FOUND,
        'ERROR',
        `Setting with ID: ${id} not found`,
        null,
      );
    }

    try {
      const settings = found;
      Object.assign(settings, updateSettingsDto);
      const updatedData = new this.settingsRepository(settings);
      const result = await updatedData.save();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update success',
        content: JSON.stringify(updateSettingsDto),
        module: 'settings',
      });
      return new BaseResponse<Settings>(
        HttpStatus.CREATED,
        'UPDATED',
        'Setting successfully updated',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'update failed',
        content: error.message,
        module: 'settings',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async delete(settingsDto: SettingsDto, req): Promise<BaseResponse<Settings>> {
    const settings = await this.settingsRepository.findOne({
      _id: settingsDto.id,
    });
    if (!settings) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: 'Settings not found',
        module: 'settings',
      });
      return new BaseResponse<Settings>(
        HttpStatus.NOT_FOUND,
        'NOT FOUND',
        'Settings not found',
        null,
      );
    }

    try {
      const result = await settings.remove();
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete success',
        content: JSON.stringify(settings),
        module: 'settings',
      });
      return new BaseResponse<Settings>(
        HttpStatus.CREATED,
        'DELETED',
        'Settings has been deleted',
        result,
      );
    } catch (error) {
      this.logsService.create({
        user_id: req.user.id,
        activity: 'delete failed',
        content: error.message,
        module: 'settings',
      });
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }

  async filter(filterDto: FilterDto): Promise<BaseResponse<Settings[]>> {
    const { page, size, orderBy, filter } = filterDto;
    try {
      const settings = await this.settingsRepository
        .find({ filter })
        .limit(size)
        .skip((page - 1) * size)
        .sort({
          created_at: orderBy === orderBy ? -1 : 1,
        });
      const pagination = new PaginationBuilder()
        .page(page)
        .size(size)
        .totalContent(settings.length)
        .build();

      return new BaseResponse<Settings[]>(
        HttpStatus.OK,
        'FIND ALL',
        null,
        settings,
        pagination,
      );
    } catch (error) {
      throw new BadRequestException(
        `Anda mengalami error: ${error.message}. Hubungi Admin untuk bantuan`,
      );
    }
  }
}
