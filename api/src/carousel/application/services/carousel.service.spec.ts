import { CarouselRepository } from "../../domain/repository/carousel.repository";
import { CarouselService } from "./carousel.service";
import { Carousel } from "../../domain/entities/carousel.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCarouselDto } from "../dto/create-carousel.dto";
import { Readable } from "stream";
import { MediaService } from "src/media/domain/media.service";

describe("CarouselService", () => {
  let service: CarouselService;
  let repository: jest.Mocked<CarouselRepository>;
  let media: jest.Mocked<MediaService>;
  const testingFile: Express.Multer.File = {
    fieldname: "file",
    originalname: "test-image.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    size: 1024,
    destination: "/tmp",
    filename: "12345-test-image.jpg",
    path: "/tmp/12345-test-image.jpg",
    buffer: Buffer.from("fake image content"),
    stream: new Readable(),
  };
  const dto: Partial<Carousel> = {
    // image: "/203846-92082392.jpg",
    postId: 1,
    koreanTitle: "한글",
    koreanDescription: "한글설명",
    englishTitle: "영어",
    englishDescription: "영어설명",
    japaneseTitle: "일본어",
    japaneseDescription: "일본어설명",
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
            getOne: jest.fn(),
          },
        },
        {
          provide: MediaService,
          useValue: {
            uploadImage: jest.fn(),
            uploadAttachment: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<CarouselService>(CarouselService);
    repository = module.get(CarouselRepository);
    media = module.get(MediaService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("create", () => {
    it("should create a carousel", async () => {
      const returnCarousel = new Carousel(
        dto.image!,
        dto.postId!,
        dto.koreanTitle!,
        dto.koreanDescription!,
        dto.englishTitle!,
        dto.englishDescription!,
        dto.japaneseTitle!,
        dto.japaneseDescription!,
        1,
      );
      repository.create.mockResolvedValue(returnCarousel);
      media.uploadImage.mockResolvedValue(testingFile.path);
      const result = await service.create(
        dto as CreateCarouselDto,
        testingFile,
      );
      expect(result).toEqual(true);
    });
  });
  describe("getAll", () => {
    it("should getAll carousel", async () => {
      const returnList = [
        new Carousel(
          dto.image!,
          dto.postId!,
          dto.koreanTitle!,
          dto.koreanDescription!,
          dto.englishTitle!,
          dto.englishDescription!,
          dto.japaneseTitle!,
          dto.japaneseDescription!,
          1,
        ),
        new Carousel(
          dto.image!,
          dto.postId!,
          dto.koreanTitle!,
          dto.koreanDescription!,
          dto.englishTitle!,
          dto.englishDescription!,
          dto.japaneseTitle!,
          dto.japaneseDescription!,
          2,
        ),
      ];
      const processedList = [
        {
          id: 1,
          image: dto.image,
          postId: dto.postId,
          title: dto.koreanTitle,
          description: dto.koreanDescription,
        },
        {
          id: 2,
          image: dto.image,
          postId: dto.postId,
          title: dto.koreanTitle,
          description: dto.koreanDescription,
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
        dto.koreanDescription!,
        dto.englishTitle!,
        dto.englishDescription!,
        dto.japaneseTitle!,
        dto.japaneseDescription!,
        1,
      );
      repository.update.mockResolvedValue(returnCarousel);
      media.uploadImage.mockResolvedValue(testingFile.path);
      const result = await service.update(
        1,
        { koreanTitle: "수정된 한글" },
        testingFile,
      );

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
