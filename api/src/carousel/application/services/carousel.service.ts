import { Injectable } from "@nestjs/common";
import { CreateCarouselDto } from "../dto/create-carousel.dto";
import { CarouselRepository } from "src/carousel/domain/repository/carousel.repository";
import { UpdateCarouselDto } from "../dto/update-carousel.dto";

@Injectable()
export class CarouselService {
  constructor(private readonly carouselRepository: CarouselRepository) {}
  async create(createdto: CreateCarouselDto) {
    const carousel = await this.carouselRepository.create(createdto);

    return carousel;
  }
  async findAll() {
    const carousel = await this.carouselRepository.getAll();
    return carousel;
  }
  async update(id: number, updatedto: UpdateCarouselDto) {
    await this.carouselRepository.update(id, updatedto);
  }
  async delete(id: number) {
    await this.carouselRepository.delete(id);
  }
}
