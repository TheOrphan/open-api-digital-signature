import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseResponse } from 'src/utils/base/response/base.response';
import { KYC as KYCTTD } from 'src/utils/base/schema/kyc.schema';
import { KycSpecimentDto } from '../dtos/kyc-ttd.create.dto';
import { KYCTTDService } from '../services/kyc-ttd.service';

@ApiTags('KYCTTD')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('kyc-ttd')
export class KYCTTDController {
  constructor(private kycttdService: KYCTTDService) {}

  @Post('send-speciment')
  async getAll(
    @Body() kycSpecimentDto: KycSpecimentDto,
    @Req() req,
  ): Promise<BaseResponse<KYCTTD[]>> {
    return this.kycttdService.sendSpeciment(kycSpecimentDto, req);
  }
}
