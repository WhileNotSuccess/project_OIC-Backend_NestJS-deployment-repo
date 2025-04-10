import { Injectable } from "@nestjs/common";
import { CreateCarouselDto } from "../dto/create-carousel.dto";
import { CarouselRepository } from "src/carousel/domain/repository/carousel.repository";
import { UpdateCarouselDto } from "../dto/update-carousel.dto";

@Injectable()
export class CarouselService {
  constructor(private readonly carouselRepository: CarouselRepository) {}
  async create(createdto: CreateCarouselDto) {
    const carousel = await this.carouselRepository.create(createdto);
    return !!carousel;
  }
  async findAll(language: string) {
    const carousel = await this.carouselRepository.getAll();
    const returnCarousel = carousel.map((item) => {
      let languageObject: object;
      switch (language) {
        case "english":
          languageObject = {
            title: item.EnglishTitle,
            description: item.EnglishDescription,
          };
          break;
        case "japanese":
          languageObject = {
            title: item.JapaneseTitle,
            description: item.JapaneseDescription,
          };
          break;
        default:
          languageObject = {
            title: item.KoreanTitle,
            description: item.KoreanDescription,
          };
      }
      return {
        ...languageObject,
        id: item.id,
        image: item.image,
        postId: item.postId,
      };
    });
    return returnCarousel;
  }
  async update(id: number, updatedto: UpdateCarouselDto) {
    const carousel = await this.carouselRepository.update(id, updatedto);
    return !!carousel;
  }
  async delete(id: number) {
    const carousel = await this.carouselRepository.delete(id);
    return carousel;
  }
}
