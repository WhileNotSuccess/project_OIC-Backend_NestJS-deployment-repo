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
  // multer.file 더미데이터
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

  // 여기서 부터 테스트 실행
  it("should create a carousel", async () => {
    // repository mock 객체 생성
    const returnCarousel = new Carousel(
      testingFile.path,
      dto.postId!,
      dto.koreanTitle!,
      dto.koreanDescription!,
      dto.englishTitle!,
      dto.englishDescription!,
      dto.japaneseTitle!,
      dto.japaneseDescription!,
      1,
    );
    // mock 객체 설정
    repository.create.mockResolvedValue(returnCarousel);
    media.uploadImage.mockResolvedValue(testingFile.path);
    // create 실행후 비교
    const result = await service.create(dto as CreateCarouselDto, testingFile);
    expect(result).toEqual(true);
  });

  it("should find all carousel", async () => {
    // repository가 반환할 mock 배열
    const returnList = [
      new Carousel(
        testingFile.path,
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
        testingFile.path,
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
    // service가 반환할 가공된 배열
    const processedList = [
      {
        id: 1,
        image: testingFile.path,
        postId: dto.postId,
        title: dto.koreanTitle,
        description: dto.koreanDescription,
      },
      {
        id: 2,
        image: testingFile.path,
        postId: dto.postId,
        title: dto.koreanTitle,
        description: dto.koreanDescription,
      },
    ];
    // mock 설정
    repository.getAll.mockResolvedValue(returnList);
    // findAll 실행후 가공된 배열과 같은지 비교
    const result = await service.findAll("korean");
    expect(result).toStrictEqual(processedList);
  });

  it("should find one carousel", async () => {
    //mock 객체 생성 
    const mockedValue = new Carousel(
      testingFile.path,
      dto.postId!,
      dto.koreanTitle!,
      dto.koreanDescription!,
      dto.englishTitle!,
      dto.englishDescription!,
      dto.japaneseTitle!,
      dto.japaneseDescription!,
      1,
    );
    // mock 설정
    repository.getOne.mockResolvedValue(mockedValue);
    // service 실행후 비교
    const result = await service.getOne(1);
    expect(result).toStrictEqual(mockedValue);
  });
  it("should update a carousel", async () => {
    // mock 객체 생성
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
    // mock 설정
    repository.update.mockResolvedValue(returnCarousel);
    media.uploadImage.mockResolvedValue(testingFile.path);
    // update 실행후 boolean 반환 확인
    const result = await service.update(
      1,
      { koreanTitle: "수정된 한글" },
      testingFile,
    );
    expect(result).toBe(true);
  });

  it("should delete a carousel", async () => {
    // mock 설정
    repository.delete.mockResolvedValue(true);
    // delete 요청
    const result = await service.delete(1);
    // boolean 반환 확인
    expect(result).toEqual(true);
  });
});
