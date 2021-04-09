import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SettingsCreateDto } from '../dtos/settings.create.dto';
import { SettingsDto } from '../dtos/settings.dto';
import { SettingsUpdateDto } from '../dtos/settings.update.dto';
import { Settings } from '../schemas/settings.schema';
import { SettingsService } from '../services/settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Settings[]>> {
    return this.settingsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(
    @Body() settingsDto: SettingsDto,
  ): Promise<BaseResponse<Settings>> {
    return this.settingsService.getById(settingsDto);
  }

  @Post('create')
  async create(
    @Body() SettingsCreateDto: SettingsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Settings>> {
    return this.settingsService.create(SettingsCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() SettingsUpdateDto: SettingsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.settingsService.update(SettingsUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() settingsDto: SettingsDto,
    @Req() req,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.settingsService.delete(settingsDto, req);
  }

  @Post('get-filter')
  async filter(
    @Body() filterDto: FilterDto,
  ): Promise<BaseResponse<Settings[]>> {
    return this.settingsService.filter(filterDto);
  }
}
