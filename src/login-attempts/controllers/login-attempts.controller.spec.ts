import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttempsController } from './login-attemps.controller';

describe('LoginAttempsController', () => {
  let controller: LoginAttempsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginAttempsController],
    }).compile();

    controller = module.get<LoginAttempsController>(LoginAttempsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
