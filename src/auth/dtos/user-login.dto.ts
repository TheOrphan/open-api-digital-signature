import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  email: string;
  password: string;
}
