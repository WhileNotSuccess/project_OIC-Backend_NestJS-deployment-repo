import { Test, TestingModule } from '@nestjs/testing';
import { PrideOfYjuService } from './pride-of-yju.service';

describe('PrideOfYjuService', () => {
  let service: PrideOfYjuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrideOfYjuService],
    }).compile();

    service = module.get<PrideOfYjuService>(PrideOfYjuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
