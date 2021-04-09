import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { UsersCreateDto } from '../dtos/users.create.dto';
import { UsersDto } from '../dtos/users.dto';
import { UsersUpdateDto } from '../dtos/users.update.dto';
import { Users } from '../schemas/users.schema';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<Users[]>> {
    return this.usersService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(@Body() usersDto: UsersDto): Promise<BaseResponse<Users>> {
    return this.usersService.getById(usersDto);
  }

  @Post('create')
  async create(
    @Body() usersCreateDto: UsersCreateDto,
    @Req() req,
  ): Promise<BaseResponse<Users>> {
    return this.usersService.create(usersCreateDto, req);
  }

  @Post('update')
  async update(
    @Body() usersUpdateDto: UsersUpdateDto,
    @Req() req,
  ): Promise<BaseResponse<Users>> {
    return await this.usersService.update(usersUpdateDto, req);
  }

  @Post('delete')
  async delete(
    @Body() usersDto: UsersDto,
    @Req() req,
  ): Promise<BaseResponse<Users>> {
    return this.usersService.delete(usersDto, req);
  }

  @Post('get-filter')
  async filter(@Body() filterDto: FilterDto): Promise<BaseResponse<Users[]>> {
    return this.usersService.filter(filterDto);
  }
}
