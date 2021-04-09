import { Controller, Post, Body, Req } from '@nestjs/common';
import { HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

/**
 * Non Default Library
 */
import { LoginResponse } from 'src/utils/base/response/login.response';
import { BaseResponse } from 'src/utils/base/response/base.response';
import { UserLoginDto } from '../dtos/user-login.dto';
import { AuthService } from '../services/auth.service';
import { Users } from 'src/users/schemas/users.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AUTH');

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Req() req,
  ): Promise<LoginResponse<Users>> {
    return this.authService.login(userLoginDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('token')
  checkToken(): BaseResponse<any> {
    return new BaseResponse<any>(HttpStatus.ACCEPTED, '', 'cek token', null);
  }
}
