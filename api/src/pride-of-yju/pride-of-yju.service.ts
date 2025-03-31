import { Injectable } from '@nestjs/common';
import { CreatePrideOfYjuDto } from './dto/create-pride-of-yju.dto';
import { UpdatePrideOfYjuDto } from './dto/update-pride-of-yju.dto';

@Injectable()
export class PrideOfYjuService {
  create(createPrideOfYjuDto: CreatePrideOfYjuDto) {
    return 'This action adds a new prideOfYju';
  }

  findAll() {
    return `This action returns all prideOfYju`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prideOfYju`;
  }

  update(id: number, updatePrideOfYjuDto: UpdatePrideOfYjuDto) {
    return `This action updates a #${id} prideOfYju`;
  }

  remove(id: number) {
    return `This action removes a #${id} prideOfYju`;
  }
}
