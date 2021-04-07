import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { DeleteResult, UpdateResult } from 'typeorm';
import { LoginAttemptsCreateDto } from '../dtos/login-attempts.create.dto';
import { LoginAttemptsDto } from '../dtos/login-attempts.dto';
import { LoginAttemptsUpdateDto } from '../dtos/login-attempts.update.dto';
import { LoginAttempts } from '../entities/login-attempts.entity';
import { LoginAttemptsService } from '../services/login-attempts.service';

@ApiTags('Login attempts')
// @ApiBearerAuth()
// @UseGuards(AuthGuard())
@Controller('login-attempts')
export class LoginAttemptsController {
  constructor(private LoginAttemptsService: LoginAttemptsService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<LoginAttempts[]>> {
    return this.LoginAttemptsService.getAllData(getAllDataDto);
  }

  @Post('get-by-id')
  async getById(
    @Body() LoginAttemptsDto: LoginAttemptsDto,
  ): Promise<BaseResponse<LoginAttempts>> {
    return this.LoginAttemptsService.getById(LoginAttemptsDto);
  }

  @Post('create')
  async create(
    @Body() LoginAttemptsCreateDto: LoginAttemptsCreateDto,
  ): Promise<BaseResponse<LoginAttempts>> {
    return this.LoginAttemptsService.create(LoginAttemptsCreateDto);
  }

  @Post('update')
  async update(
    @Body() LoginAttemptsUpdateDto: LoginAttemptsUpdateDto,
  ): Promise<BaseResponse<UpdateResult>> {
    return await this.LoginAttemptsService.update(LoginAttemptsUpdateDto);
  }

  @Post('delete')
  async delete(
    @Body() LoginAttemptsDto: LoginAttemptsDto,
  ): Promise<BaseResponse<DeleteResult>> {
    return this.LoginAttemptsService.delete(LoginAttemptsDto);
  }

  @Post('get-filter')
  async filter(
    @Body() filterDto: FilterDto,
  ): Promise<BaseResponse<LoginAttempts[]>> {
    return this.LoginAttemptsService.filter(filterDto);
  }
}
