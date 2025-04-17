import { CarouselController } from "./carousel.controller";
import { CarouselService } from "../../application/services/carousel.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCarouselDto } from "../../application/dto/create-carousel.dto";
import { Request } from "express";
import {
  Carousel,
  ReturnCarousel,
} from "../../domain/entities/carousel.entity";
import { Readable } from "stream";

describe("CarouselController", () => {
  let controller: CarouselController;
  let service: jest.Mocked<CarouselService>;
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
    postId: 1,
    koreanTitle: "한글",
    koreanDescription: "한글설명",
    englishTitle: "영어",
    englishDescription: "영어설명",
    japaneseTitle: "일본어",
    japaneseDescription: "일본어설명",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarouselController],
      providers: [
        {
          provide: CarouselService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CarouselController>(CarouselController);
    service = module.get(CarouselService);
  });

  it("should be defined", () => {
    // 단일 동작, 이 경우에는 각 describe가 실행 되기 전 beforeEach가 실행되어 controller가 정의되었는지 확인
    expect(controller).toBeDefined();
  });

  it("should create a carousel", async () => {
    //mock 설정
    service.create.mockResolvedValue(true);
    // create 실행
    const result = await controller.create(testingFile, {
      ...(dto as CreateCarouselDto),
    });
    //message 비교
    expect(result.message).toEqual("작성에 성공했습니다.");
    // expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("should return all carousel", async () => {
    // mock 배열
    const carouselList: ReturnCarousel[] = [
      {
        image: "/carousel/123456-image.jpg",
        postId: 1,
        title: dto.koreanTitle + "1",
        description: dto.koreanDescription + "1",
        id: 1,
      },
      {
        image: "/carousel/098765-image.jpg",
        postId: 2,
        title: dto.koreanTitle + "2",
        description: dto.koreanDescription + "2",
        id: 2,
      },
    ];
    // 요청에 넣을 cookie
    const mockRequest = {
      cookies: [{ language: "korean" }],
    } as unknown as Request;
    // mock 설정
    service.findAll.mockResolvedValue(carouselList);
    // findAll 실행
    const result = await controller.findAll(mockRequest);
    // 비교
    expect(result.message).toBe("carousel을 불러왔습니다.");
    expect(result.data.length).toBeGreaterThan(0);
  });
  it("should return all raw carousel", async () => {
    const carouselList = [
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
    service.getRawAll.mockResolvedValue(carouselList);
    const result = await controller.getRawAll();
    expect(result).toStrictEqual(carouselList);
  });

  it("should patch one carousel", async () => {
    // mock 설정
    service.update.mockResolvedValue(true);
    // update 실행
    const result = await controller.update(
      1,
      {
        koreanTitle: "수정된 한국어",
      },
      testingFile,
    );
    // body.message 비교
    expect(result.message).toBe("수정에 성공했습니다.");
  });

  it("should find one carousel", async () => {
    // mock 객체
    const carousel = new Carousel(
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
    service.getOne.mockResolvedValue(carousel);
    // getOne 실행
    const result = await controller.getOne(1);
    // body.data 비교
    expect(result.data).toStrictEqual(carousel);
  });

  it("should delete one carousel", async () => {
    // mock 설정
    service.update.mockResolvedValue(true);
    // delete 실행
    const result = await controller.delete(1);
    // body.message 비교
    expect(result.message).toBe("삭제에 성공했습니다.");
  });
});
