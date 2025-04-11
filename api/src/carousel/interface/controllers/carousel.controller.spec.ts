import { CarouselController } from "./carousel.controller";
import { CarouselService } from "../../application/services/carousel.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCarouselDto } from "../../application/dto/create-carousel.dto";
import { Request } from "express";
import { ReturnCarousel } from "../../domain/entities/carousel-return.entiry";
import { Carousel } from "../../domain/entities/carousel.entity";

describe("CarouselController", () => {
  let controller: CarouselController;
  let service: jest.Mocked<CarouselService>;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarouselController],
      providers: [
        {
          provide: CarouselService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
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

  describe("create", () => {
    // describe는 it(단일 동작)을 그룹화
    it("should create a carousel", async () => {
      service.create.mockResolvedValue(true); //mock 설정

      const result = await controller.create({ ...(dto as CreateCarouselDto) });

      expect(result.message).toEqual("작성에 성공했습니다.");
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
  describe("findAll", () => {
    it("should return all carousel", async () => {
      const carouselList = [
        new ReturnCarousel(
          "/123456-image.jpg",
          1,
          dto.KoreanTitle + "1",
          dto.KoreanDescription + "1",
          1,
        ),
        new ReturnCarousel(
          "/098765-image.jpg",
          2,
          dto.KoreanTitle + "2",
          dto.KoreanDescription + "2",
          2,
        ),
      ];
      // document.cookie = "language=korean;path=/"; // 쿠키 설정
      // const cookies = document.cookie;
      // expect(cookies).toContain("language=korean"); // 쿠키가 설정됐는지 확인
      const mockRequest = {
        cookies: [{ language: "korean" }],
      } as unknown as Request;
      service.findAll.mockResolvedValue(carouselList);
      const result = await controller.findAll(mockRequest);
      expect(result.message).toBe("carousel을 불러왔습니다.");
      expect(result.data.length).toBeGreaterThan(0);
    });
  });
  describe("update", () => {
    it("should patch one carousel", async () => {
      service.update.mockResolvedValue(true);
      const result = await controller.update(1, {
        KoreanTitle: "수정된 한국어",
      });
      expect(result.message).toBe("수정에 성공했습니다.");
    });
  });
  describe("delete", () => {
    it("should delete one carousel", async () => {
      service.update.mockResolvedValue(true);
      const result = await controller.delete(1);
      expect(result.message).toBe("삭제에 성공했습니다.");
    });
  });
});
