import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UsersGroupsCreateDto } from '../dtos/users-groups.create.dto';
import { UsersGroupsDto } from '../dtos/users-groups.dto';
import { UsersGroupsUpdateDto } from '../dtos/users-groups.update.dto';
import { UsersGroups } from '../schemas/users-groups.schema';
import { UsersGroupsService } from '../services/users-groups.service';

@ApiTags('Users groups')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('users-groups')
export class UsersGroupsController {
  constructor(private usersGroupsService: UsersGroupsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<UsersGroups[]>> {
    return this.usersGroupsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(
    @Body() usersGroupsDto: UsersGroupsDto,
  ): Promise<BaseResponse<UsersGroups>> {
    return this.usersGroupsService.getById(usersGroupsDto);
  }

  @Post('create')
  async create(
    @Body() UsersGroupsCreateDto: UsersGroupsCreateDto,
    @Req() req,
  ): Promise<BaseResponse<UsersGroups>> {
    return this.usersGroupsService.create(UsersGroupsCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() UsersGroupsUpdateDto: UsersGroupsUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.usersGroupsService.update(UsersGroupsUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() usersGroupsDto: UsersGroupsDto,
    @Req() req,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.usersGroupsService.delete(usersGroupsDto, req);
  }

  @Post('get-filter')
  async filter(
    @Body() filterDto: FilterDto,
  ): Promise<BaseResponse<UsersGroups[]>> {
    return this.usersGroupsService.filter(filterDto);
  }
}
