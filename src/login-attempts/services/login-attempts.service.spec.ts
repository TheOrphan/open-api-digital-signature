import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttempsService } from './login-attemps.service';

describe('LoginAttempsService', () => {
  let service: LoginAttempsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAttempsService],
    }).compile();

    service = module.get<LoginAttempsService>(LoginAttempsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
