import { BadRequestException, Injectable } from "@nestjs/common";
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
    // 파일 경로
    const fileURL = await this.mediaService.uploadImage(file, "carousel");
    // db 저장
    const carousel = await this.carouselRepository.create({
      ...createdto,
      image: fileURL,
    });

    return !!carousel;
  }
  async findAll(language: string) {
    const carousel = await this.carouselRepository.getAll();
    // 언어에 맞춰 title, description열을 재생성
    // korean--, english--, japanese-- 중 하나를 title, description열로 만들어 return
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
  async getOne(id: number) {
    const carousel = await this.carouselRepository.getOne(id);
    // null일 경우 id가 잘못됐다는 400에러
    if (!carousel)
      throw new BadRequestException("해당 id의 carousel이 존재하지 않습니다.");
    return carousel;
  }

  async update(
    id: number,
    updatedto: UpdateCarouselDto,
    file: Express.Multer.File,
  ) {
    // 이미지가 있을 경우 저장 후 경로 받아오기
    let imageUrl: string;
    if (file) imageUrl = await this.mediaService.uploadImage(file, "carousel");
    // 수정, 내부에서 이미지 경로가 없을 경우 기존 경로를 사용하도록 되어있음
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
