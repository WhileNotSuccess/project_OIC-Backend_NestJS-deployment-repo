import { Module } from '@nestjs/common';
import { PrideOfYjuService } from './pride-of-yju.service';
import { PrideOfYjuController } from './pride-of-yju.controller';

@Module({
  controllers: [PrideOfYjuController],
  providers: [PrideOfYjuService],
})
export class PrideOfYjuModule {}
