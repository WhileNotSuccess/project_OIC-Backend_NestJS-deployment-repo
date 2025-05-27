import { Test, TestingModule } from "@nestjs/testing";
import { CorporationController } from "./corporation.controller";
import { CorporationService } from "../application/corporation.service";
import { RequestWithCookies } from "src/common/request-with-cookies";

describe("CorporationController", () => {
  let controller: CorporationController;
  let service: jest.Mocked<CorporationService>;
  const mockRequest = {
    cookies: { language: "korean" },
  } as unknown as RequestWithCookies;
  const corporationDto = {
    koreanName: "단체",
    englishName: "dantai",
    corporationType: "type",
    countryId: 1,
  };
  const countryDto = {
    name: "나라",
    englishName: "country",
    japaneseName: "kuni",
    x: 1,
    y: 1,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporationController],
      providers: [
        {
          provide: CorporationService,
          useValue: {
            createCorporation: jest.fn(),
            createCountry: jest.fn(),
            updateCorporation: jest.fn(),
            updateCountry: jest.fn(),
            deleteCorporation: jest.fn(),
            deleteCountry: jest.fn(),
            getAllCountry: jest.fn(),
            getCorporationByCountry: jest.fn(),
            countCorporationAndCountry: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CorporationController>(CorporationController);
    service = module.get(CorporationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("createCorporation", async () => {
    jest.spyOn(service, "createCorporation").mockResolvedValue({
      ...corporationDto,
      id: 1,
    });
    const result = await controller.createCorporation(corporationDto);
    expect(result).toMatchObject({
      message: "생성이 완료되었습니다.",
    });
    expect(service.createCorporation).toHaveBeenCalledWith(corporationDto);
  });
  it("count", async () => {
    jest.spyOn(service, "countCorporationAndCountry").mockResolvedValue([5, 4]);
    const result = await controller.countCorporationAndCountry();
    expect(result).toMatchObject({
      message: "협약기관, 국가 수를 조회했습니다.",
      data: {
        corporationCount: 5,
        countryCount: 4,
      },
    });
    expect(service.countCorporationAndCountry).toHaveBeenCalled();
  });
  it("updateCorporation", async () => {
    jest.spyOn(service, "updateCorporation").mockResolvedValue({
      ...corporationDto,
      id: 1,
    });
    const result = await controller.updateCorporation("1", corporationDto);
    expect(result).toMatchObject({
      message: "수정이 완료되었습니다.",
    });
    expect(service.updateCorporation).toHaveBeenCalledWith(1, corporationDto);
  });

  it("removeCorporation", async () => {
    jest.spyOn(service, "deleteCorporation").mockResolvedValue(true);
    const result = await controller.removeCorporation("1");
    expect(result).toMatchObject({
      message: "삭제가 완료되었습니다.",
    });
    expect(service.deleteCorporation).toHaveBeenCalledWith(1);
  });

  it("createCountry", async () => {
    jest.spyOn(service, "createCountry").mockResolvedValue({
      ...countryDto,
      id: 1,
    });
    const result = await controller.createCountry(countryDto);
    expect(result).toMatchObject({
      message: "생성이 완료되었습니다.",
    });
    expect(service.createCountry).toHaveBeenCalledWith(countryDto);
  });

  it("updateCountry", async () => {
    jest.spyOn(service, "updateCountry").mockResolvedValue({
      ...countryDto,
      id: 1,
    });
    const result = await controller.updateCountry("1", countryDto);
    expect(result).toMatchObject({
      message: "수정이 완료되었습니다.",
    });
    expect(service.updateCountry).toHaveBeenCalledWith(1, countryDto);
  });

  it("removeCountry", async () => {
    jest.spyOn(service, "deleteCountry").mockResolvedValue(true);
    const result = await controller.removeCountry("1");
    expect(result).toMatchObject({
      message: "삭제가 완료되었습니다.",
    });
    expect(service.deleteCountry).toHaveBeenCalledWith(1);
  });

  it("findAllCorporationByCountry", async () => {
    const corporationResult = [
      { id: 1, corporationType: "전문대", name: "영진" },
    ];

    jest
      .spyOn(service, "getCorporationByCountry")
      .mockResolvedValue(corporationResult);

    const result = await controller.findAllCorporationByCountry(
      "한국",
      mockRequest,
    );
    expect(result).toMatchObject({
      message: `한국 협약기관 목록을 불러왔습니다.`,
      data: corporationResult,
    });
  });

  it("findAllCountry", async () => {
    const countryResult = [{ id: 1, name: "string", x: 1, y: 1 }];
    jest.spyOn(service, "getAllCountry").mockResolvedValue(countryResult);
    const result = await controller.findAllCountry(mockRequest);
    expect(result).toMatchObject({
      message: "나라 목록을 불러왔습니다.",
      data: countryResult,
    });
  });
});
