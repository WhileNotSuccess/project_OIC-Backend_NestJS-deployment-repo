import { PrideOfYjuController } from "./pride-of-yju.controller";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { Readable } from "stream";
import { Test, TestingModule } from "@nestjs/testing";
import { PrideOfYjuService } from "src/pride-of-yju/application/services/pride-of-yju.service";
import { CreatePrideOfYjuDto } from "src/pride-of-yju/application/dto/create-pride-of-yju.dto";

describe("prideOfYjuController", () => {
  let controller: PrideOfYjuController;
  let service: jest.Mocked<PrideOfYjuService>;
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
  const dto: Partial<PrideOfYju> = {
    korean: "한국어",
    english: "영어",
    japanese: "일본어",
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrideOfYjuController],
      providers: [
        {
          provide: PrideOfYjuService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getAll: jest.fn(),
            getOne: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<PrideOfYjuController>(PrideOfYjuController);
    service = module.get(PrideOfYjuService);
  });
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("create", () => {
    it("should create a PrideOfYju", async () => {
      service.create.mockResolvedValue(true);
      const result = await controller.create(
        { ...(dto as CreatePrideOfYjuDto) },
        testingFile,
      );
      expect(result.message).toEqual("PrideOfYju 작성에 성공했습니다.");
    });
  });
  describe("findAll", () => {
    it("should return all PrideOfYju", async () => {
      const POYList = [
        new PrideOfYju(
          testingFile.path,
          dto.korean!,
          dto.english!,
          dto.japanese!,
          1,
        ),
        new PrideOfYju(
          testingFile.path,
          dto.korean!,
          dto.english!,
          dto.japanese!,
          2,
        ),
      ];

      service.getAll.mockResolvedValue(POYList);
      const result = await controller.getAll();
      expect(result.data.length).toBeGreaterThan(0);
    });
  });
  describe("findOne", () => {
    it("should return one PrideOfYju", async () => {
      const POYMock = new PrideOfYju(
        testingFile.path,
        dto.korean!,
        dto.english!,
        dto.japanese!,
        1,
      );
      service.getOne.mockResolvedValue(POYMock);
      const result = await controller.getOne(1);
      expect(result.data).toEqual(POYMock);
    });
  });
  describe("update", () => {
    it("should patch one PrideOfYju", async () => {
      service.update.mockResolvedValue(true);
      const result = await controller.update(
        1,
        { korean: "수정된 한글" },
        testingFile,
      );
      expect(result.message).toBe("PrideOfYju 수정에 성공했습니다.");
    });
  });
  describe("delete", () => {
    it("should delete one PrideOfYju", async () => {
      service.update.mockResolvedValue(true);
      const result = await controller.delete(1);
      expect(result.message).toBe("PrideOfYju 삭제에 성공했습니다.");
    });
  });
});
