import { PrideOfYjuRepository } from "src/pride-of-yju/domain/repository/pride-of-yju.repository";
import { PrideOfYjuService } from "./pride-of-yju.service";
import { MediaService } from "src/media/domain/media.service";
import { Readable } from "stream";
import { Test, TestingModule } from "@nestjs/testing";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";

describe("PrideOfYjuService", () => {
  let service: PrideOfYjuService;
  let repository: jest.Mocked<PrideOfYjuRepository>;
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
  const dto = {
    Korean: "한글",
    English: "영어",
    Japanese: "일본어",
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrideOfYjuService,
        {
          provide: PrideOfYjuRepository,
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
    service = module.get<PrideOfYjuService>(PrideOfYjuService);
    repository = module.get(PrideOfYjuRepository);
    media = module.get(MediaService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  // 여기서부터 테스트 실행
  it("should create a PrideOfYju", async () => {
    // mock 설정
    const returnPride = new PrideOfYju(
      testingFile.path,
      dto.Korean,
      dto.English,
      dto.Japanese,
      1,
    );
    repository.create.mockResolvedValue(returnPride);
    media.uploadImage.mockResolvedValue(testingFile.path);
    // create 실행 후 결과 확인
    const result = await service.create(testingFile, dto);
    expect(result).toBe(true);
  });
  it("should return all PrideOfYju", async () => {
    // mock 설정
    const returnPride = [
      new PrideOfYju(
        testingFile.path,
        dto.Korean,
        dto.English,
        dto.Japanese,
        1,
      ),
      new PrideOfYju(
        testingFile.path,
        dto.Korean,
        dto.English,
        dto.Japanese,
        2,
      ),
    ];
    repository.getAll.mockResolvedValue(returnPride);
    // getAll 실행후 결과 확인
    const result = await service.getAll();
    expect(result[0].image).toBe(testingFile.path);
    expect(result[0].English).toBe(dto.English);
  });
  it("should return one PrideOfYju", async () => {
    // mock 설정
    const returnPride = new PrideOfYju(
      testingFile.path,
      dto.Korean,
      dto.English,
      dto.Japanese,
      1,
    );
    repository.getOne.mockResolvedValue(returnPride);
    // getOne 실행후 결과 확인
    const result = await service.getOne(1);
    expect(result).toStrictEqual(returnPride);
  });
  it("should update a PrideOfYju", async () => {
    // mock 설정
    const returnPride = new PrideOfYju(
      testingFile.path,
      "수정된 한글",
      dto.English,
      dto.Japanese,
      1,
    );
    repository.update.mockResolvedValue(returnPride);
    media.uploadImage.mockResolvedValue(testingFile.path);
    // update 실행후 결과 확인
    const result = await service.update(1, testingFile, {
      Korean: "수정된 한글",
    });
    expect(result).toBe(true);
  });
  it("should delete a PrideOfYju", async () => {
    // mock 설정
    repository.delete.mockResolvedValue(true);
    // delete 샐행후 결과 확인
    const result = await service.delete(1);
    expect(result).toBe(true);
  });
});
