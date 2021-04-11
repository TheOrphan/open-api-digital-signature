import { Test, TestingModule } from '@nestjs/testing';
import { KYCTTDController } from './kyc-ttd.controller';

describe('KYCTTDController', () => {
  let controller: KYCTTDController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KYCTTDController],
    }).compile();

    controller = module.get<KYCTTDController>(KYCTTDController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
