import { Test, TestingModule } from "@nestjs/testing";
import { CorporationService } from "./corporation.service";
import { CorporationRepository } from "../domain/repository/corporation.repository";
import { Country } from "../domain/entities/country.entity";
import { Corporation } from "../domain/entities/corporation.entity";
import { toLanguageEnum } from "src/common/utils/to-language-enum";

describe("CorporationService", () => {
  let service: CorporationService;
  let repository: jest.Mocked<CorporationRepository>;
  const testCountry: Country[] = [
    new Country("한국", "korea", "韓国", 100, 100),
    new Country("중국", "china", "中国", 100, 100),
    new Country("일본", "japan", "日本", 100, 100),
    new Country("미국", "america", "アメリカ", 100, 100),
  ];
  const testCorporation: Corporation[] = [
    new Corporation("영진전문대학교", "yeungjin", "전문대학", 1),
    new Corporation("중국전문대학교", "china", "대학", 2),
    new Corporation("일본전문대학교", "japan", "대학", 3),
    new Corporation("미국전문대학교", "america", "기관", 4),
    new Corporation("한국국전문대학교", "korea", "대학", 1),
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorporationService,
        {
          provide: CorporationRepository,
          useValue: {
            createCorporation: jest.fn(),
            updateCorporation: jest.fn(),
            deleteCorporation: jest.fn(),
            createCountry: jest.fn(),
            updateCountry: jest.fn(),
            deleteCountry: jest.fn(),
            getCorporationByCountryId: jest.fn(),
            getAllCorporation: jest.fn(),
            getAllCountry: jest.fn(),
            countCountry: jest.fn(),
            countCorporation: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(CorporationRepository);
    service = module.get<CorporationService>(CorporationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("country", async () => {
      for (let index = 0; index < testCountry.length; index++) {
        const element = testCountry[index];
        jest.spyOn(repository, "createCountry").mockResolvedValue(element);
        const result = await service.createCountry(element);
        expect(result).toMatchObject(element);
        expect(repository.createCountry).toHaveBeenCalledWith(element);
      }
    });
    it("corporation", async () => {
      for (let index = 0; index < testCorporation.length; index++) {
        const element = testCorporation[index];
        jest.spyOn(repository, "createCorporation").mockResolvedValue(element);
        const result = await service.createCorporation(element);
        expect(result).toMatchObject(element);
        expect(repository.createCorporation).toHaveBeenCalledWith(element);
      }
    });
  });
  describe("count", () => {
    it("corporation and country", async () => {
      jest.spyOn(repository, "countCorporation").mockResolvedValue(5);
      jest.spyOn(repository, "countCountry").mockResolvedValue(4);
      const result = await service.countCorporationAndCountry();
      expect(result).toEqual([5, 4]);
      expect(repository.countCorporation).toHaveBeenCalled();
      expect(repository.countCountry).toHaveBeenCalled();
    });
  });
  describe("update", () => {
    it("country", async () => {
      jest.spyOn(repository, "updateCountry").mockResolvedValue({
        name: "한국",
        englishName: "korea",
        japaneseName: "韓国",
        x: 99,
        y: 99,
        id: 1,
      });
      const result = await service.updateCountry(1, { x: 99, y: 99 });
      expect(result).toMatchObject({
        name: "한국",
        englishName: "korea",
        japaneseName: "韓国",
        x: 99,
        y: 99,
        id: 1,
      });
      expect(repository.updateCountry).toHaveBeenCalledWith(
        { x: 99, y: 99 },
        1,
      );
    });
    it("corporation", async () => {
      jest.spyOn(repository, "updateCorporation").mockResolvedValue({
        koreanName: "영진전문대학교",
        englishName: "yeungjin university",
        corporationType: "전문대학",
        countryId: 1,
        id: 1,
      });
      const result = await service.updateCorporation(1, {
        englishName: "yeungjin university",
      });
      expect(result).toMatchObject({
        koreanName: "영진전문대학교",
        englishName: "yeungjin university",
        corporationType: "전문대학",
        countryId: 1,
        id: 1,
      });
      expect(repository.updateCorporation).toHaveBeenCalledWith(
        {
          englishName: "yeungjin university",
        },
        1,
      );
    });
  });
  describe("delete", () => {
    it("corporation", async () => {
      jest.spyOn(repository, "deleteCorporation").mockResolvedValue(true);
      const result = await service.deleteCorporation(1);
      expect(result).toBe(true);
      expect(repository.deleteCorporation).toHaveBeenCalledWith(1);
    });
    it("country", async () => {
      jest.spyOn(repository, "deleteCountry").mockResolvedValue(true);
      const result = await service.deleteCountry(1);
      expect(result).toBe(true);
      expect(repository.deleteCountry).toHaveBeenCalledWith(1);
    });
  });

  it("getAllCountry", async () => {
    jest.spyOn(repository, "getAllCountry").mockResolvedValue(
      testCountry.map((item, index) => {
        return {
          ...item,
          id: index + 1,
        };
      }),
    );
    const expectedResultKorean = testCountry.map((item) => ({
      name: item.name,
      x: item.x,
      y: item.y,
    }));
    const resultKorean = await service.getAllCountry(toLanguageEnum("korean"));
    expect(new Set(resultKorean)).toMatchObject(new Set(expectedResultKorean));

    const expectedResultEnglish = testCountry.map((item) => ({
      name: item.englishName,
      x: item.x,
      y: item.y,
    }));

    const resultEnglish = await service.getAllCountry(
      toLanguageEnum("english"),
    );
    expect(new Set(resultEnglish)).toMatchObject(
      new Set(expectedResultEnglish),
    );

    const expectedResultJapanese = testCountry.map((item) => ({
      name: item.japaneseName,
      x: item.x,
      y: item.y,
    }));
    const resultJapanese = await service.getAllCountry(
      toLanguageEnum("japanese"),
    );
    expect(new Set(resultJapanese)).toMatchObject(
      new Set(expectedResultJapanese),
    );
  });
  it("getCorporationByCountry", async () => {
    jest
      .spyOn(repository, "getAllCountry")
      .mockResolvedValue([
        new Country("한국", "korea", "韓国", 1, 1, 1),
        new Country("일본", "japan", "日本", 1, 1, 2),
        new Country("중국", "china", "中国", 1, 1, 3),
      ]);
    jest
      .spyOn(repository, "getCorporationByCountryId")
      .mockResolvedValue([
        new Corporation("한국국전문대학교", "korea", "대학", 1, 1),
        new Corporation("영진전문대학교", "yeungjin", "전문대학", 1, 2),
      ]);
    const resultKorean = await service.getCorporationByCountry(
      toLanguageEnum("korean"),
      "한국",
    );
    const expectedResultKorean = [
      { name: "한국국전문대학교", corporationType: "대학", id: 1 },
      { name: "영진전문대학교", corporationType: "전문대학", id: 2 },
    ];
    expect(resultKorean).toMatchObject(expectedResultKorean);
    const resultJapan = await service.getCorporationByCountry(
      toLanguageEnum("japanese"),
      "韓国",
    );
    const resultEng = await service.getCorporationByCountry(
      toLanguageEnum("english"),
      "korea",
    );

    const expectedResultJapanAndEng = [
      { name: "korea", corporationType: "대학", id: 1 },
      { name: "yeungjin", corporationType: "전문대학", id: 2 },
    ];
    expect(resultJapan).toMatchObject(expectedResultJapanAndEng);
    expect(resultEng).toMatchObject(expectedResultJapanAndEng);
    expect(repository.getCorporationByCountryId).toHaveBeenCalledWith(1);
  });
});
