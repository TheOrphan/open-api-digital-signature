import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { LogsCreateDto } from '../dtos/logs.create.dto';
import { LogsDto } from '../dtos/logs.dto';
import { LogsUpdateDto } from '../dtos/logs.update.dto';
import { Logs } from '../schemas/logs.entity';
import { LogsService } from '../services/logs.service';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Logs[]>> {
    return this.logsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(@Body() logsDto: LogsDto): Promise<BaseResponse<Logs>> {
    return this.logsService.getById(logsDto);
  }

  @Post('create')
  async create(
    @Body() LogsCreateDto: LogsCreateDto,
  ): Promise<BaseResponse<Logs>> {
    return this.logsService.create(LogsCreateDto);
  }

  @Post('update')
  async update(
    @Body() LogsUpdateDto: LogsUpdateDto,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.logsService.update(LogsUpdateDto);
  }

  @Post('delete')
  async delete(@Body() logsDto: LogsDto): Promise<BaseResponse<DeleteResult>> {
    return this.logsService.delete(logsDto);
  }

  @Post('get-filter')
  async filter(@Body() filterDto: FilterDto): Promise<BaseResponse<Logs[]>> {
    return this.logsService.filter(filterDto);
  }
}
