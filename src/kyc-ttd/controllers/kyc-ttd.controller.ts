import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetAllDataDto } from 'src/utils/base/dto/base-query.dto';
import { FilterDto } from 'src/utils/base/dto/filter.dto';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { KYC as KYCTTD } from 'src/utils/base/schema/kyc.schema';
import { KYCTTDService } from '../services/kyc-ttd.service';

@ApiTags('KYCTTD')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('kyc-ttd')
export class KYCTTDController {
  constructor(private kycttdService: KYCTTDService) {}

  @Post('get-all')
  async getAll(
    @Body() getAllDataDto: GetAllDataDto,
  ): Promise<BaseResponse<KYCTTD[]>> {
    return this.kycttdService.getAllData(getAllDataDto);
  }
}
