import { CarouselRepository } from "src/carousel/domain/repository/carousel.repository";
import { CarouselService } from "./carousel.service";
import { Carousel } from "src/carousel/domain/entities/carousel.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCarouselDto } from "../dto/create-carousel.dto";

describe("CarouselService", () => {
  let service: CarouselService;
  let repository: jest.Mocked<CarouselRepository>;
  const dto: Partial<Carousel> = {
    image: "/203846-92082392.jpg",
    postId: 1,
    KoreanTitle: "한글",
    KoreanDescription: "한글설명",
    EnglishTitle: "영어",
    EnglishDescription: "영어설명",
    JapaneseTitle: "일본어",
    JapaneseDescription: "일본어설명",
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarouselService,
        {
          provide: CarouselRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<CarouselService>(CarouselService);
    repository = module.get(CarouselRepository);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("create", () => {
    it("should create a carousel", async () => {
      const returnCarousel = new Carousel(
        dto.image!,
        dto.postId!,
        dto.KoreanTitle!,
        dto.KoreanDescription!,
        dto.EnglishTitle!,
        dto.EnglishDescription!,
        dto.JapaneseTitle!,
        dto.JapaneseDescription!,
        1,
      );
      repository.create.mockResolvedValue(returnCarousel);
      const result = await service.create(dto as CreateCarouselDto);
      expect(result).toEqual(true);
    });
  });
  describe("getAll", () => {
    it("should getAll carousel", async () => {
      const returnList = [
        new Carousel(
          dto.image!,
          dto.postId!,
          dto.KoreanTitle!,
          dto.KoreanDescription!,
          dto.EnglishTitle!,
          dto.EnglishDescription!,
          dto.JapaneseTitle!,
          dto.JapaneseDescription!,
          1,
        ),
        new Carousel(
          dto.image!,
          dto.postId!,
          dto.KoreanTitle!,
          dto.KoreanDescription!,
          dto.EnglishTitle!,
          dto.EnglishDescription!,
          dto.JapaneseTitle!,
          dto.JapaneseDescription!,
          2,
        ),
      ];
      const processedList = [
        {
          id: 1,
          image: dto.image,
          postId: dto.postId,
          title: dto.KoreanTitle,
          description: dto.KoreanDescription,
        },
        {
          id: 2,
          image: dto.image,
          postId: dto.postId,
          title: dto.KoreanTitle,
          description: dto.KoreanDescription,
        },
      ];
      repository.getAll.mockResolvedValue(returnList);
      const result = await service.findAll("korean");
      expect(result).toStrictEqual(processedList);
    });
  });
  describe("update", () => {
    it("should update a carousel", async () => {
      const returnCarousel = new Carousel(
        dto.image!,
        dto.postId!,
        "수정된 한글",
        dto.KoreanDescription!,
        dto.EnglishTitle!,
        dto.EnglishDescription!,
        dto.JapaneseTitle!,
        dto.JapaneseDescription!,
        1,
      );
      repository.update.mockResolvedValue(returnCarousel);
      const result = await service.update(1, { KoreanTitle: "수정된 한글" });
      expect(result).toEqual(true);
    });
  });
  describe("delete", () => {
    it("should delete a carousel", async () => {
      repository.delete.mockResolvedValue(true);
      const result = await service.delete(1);
      expect(result).toEqual(true);
    });
  });
});
