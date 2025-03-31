import { Test, TestingModule } from '@nestjs/testing';
import { PrideOfYjuController } from './pride-of-yju.controller';
import { PrideOfYjuService } from './pride-of-yju.service';

describe('PrideOfYjuController', () => {
  let controller: PrideOfYjuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrideOfYjuController],
      providers: [PrideOfYjuService],
    }).compile();

    controller = module.get<PrideOfYjuController>(PrideOfYjuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
