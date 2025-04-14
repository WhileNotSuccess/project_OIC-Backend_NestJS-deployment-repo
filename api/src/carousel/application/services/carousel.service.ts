import { Injectable } from "@nestjs/common";
import { CreateCarouselDto } from "../dto/create-carousel.dto";
import { CarouselRepository } from "../../domain/repository/carousel.repository";
import { UpdateCarouselDto } from "../dto/update-carousel.dto";
import { MediaService } from "src/media/domain/media.service";

@Injectable()
export class CarouselService {
  constructor(
    private readonly carouselRepository: CarouselRepository,
    private readonly mediaService: MediaService,
  ) {}
  async create(createdto: CreateCarouselDto, file: Express.Multer.File) {
    const fileURL = await this.mediaService.uploadImage(file, "carousel");
    const carousel = await this.carouselRepository.create({
      ...createdto,
      image: fileURL,
    });

    return !!carousel;
  }
  async findAll(language: string) {
    const carousel = await this.carouselRepository.getAll();
    const returnCarousel = carousel.map((item) => {
      let languageObject: { title: string; description: string };
      switch (language) {
        case "english":
          languageObject = {
            title: item.englishTitle,
            description: item.englishDescription,
          };
          break;
        case "japanese":
          languageObject = {
            title: item.japaneseTitle,
            description: item.japaneseDescription,
          };
          break;
        default:
          languageObject = {
            title: item.koreanTitle,
            description: item.koreanDescription,
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
  async update(
    id: number,
    updatedto: UpdateCarouselDto,
    file: Express.Multer.File,
  ) {
    let imageUrl: string;
    if (file) imageUrl = await this.mediaService.uploadImage(file, "carousel");
    const carousel = await this.carouselRepository.update(id, {
      ...updatedto,
      image: imageUrl!,
    });
    return !!carousel;
  }
  async delete(id: number) {
    const carousel = await this.carouselRepository.delete(id);
    return carousel;
  }
}
