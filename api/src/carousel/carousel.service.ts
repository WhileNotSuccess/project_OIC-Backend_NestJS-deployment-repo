import { Injectable } from '@nestjs/common';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';

@Injectable()
export class CarouselService {
  create(createCarouselDto: CreateCarouselDto) {
    return 'This action adds a new carousel';
  }

  findAll() {
    return `This action returns all carousel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carousel`;
  }

  update(id: number, updateCarouselDto: UpdateCarouselDto) {
    return `This action updates a #${id} carousel`;
  }

  remove(id: number) {
    return `This action removes a #${id} carousel`;
  }
}
