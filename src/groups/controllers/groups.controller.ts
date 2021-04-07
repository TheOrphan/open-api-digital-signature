import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { GroupsCreateDto } from '../dtos/groups.create.dto';
import { GroupsDto } from '../dtos/groups.dto';
import { GroupsUpdateDto } from '../dtos/groups.update.dto';
import { Groups } from '../entities/groups.entity';
import { GroupsService } from '../services/groups.service';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Groups[]>> {
    return this.groupsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(@Body() groupsDto: GroupsDto): Promise<BaseResponse<Groups>> {
    return this.groupsService.getById(groupsDto);
  }

  @Post('create')
  async create(
    @Body() GroupsCreateDto: GroupsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Groups>> {
    return this.groupsService.create(GroupsCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() GroupsUpdateDto: GroupsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.groupsService.update(GroupsUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() groupsDto: GroupsDto,
    @Req() req,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.groupsService.delete(groupsDto, req);
  }

  @Post('get-filter')
  async filter(@Body() filterDto: FilterDto): Promise<BaseResponse<Groups[]>> {
    return this.groupsService.filter(filterDto);
  }
}
