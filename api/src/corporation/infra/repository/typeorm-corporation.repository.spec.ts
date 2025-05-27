import { DataSource } from "typeorm";
import { TypeormCorporationRepository } from "./typeorm-corporation.repository";
import { CountryOrmEntity } from "../entities/country.entity";
import { CorporationOrmEntity } from "../entities/corporation.entity";

describe("TypeormPostRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormCorporationRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "mysql",
      host: process.env.TEST_DB_HOST,
      port: Number(process.env.TEST_DB_PORT),
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
      synchronize: true,
      dropSchema: true, // 테스트 후 테이블 초기화
      entities: [CountryOrmEntity, CorporationOrmEntity],
    });
    await dataSource.initialize();
    repository = new TypeormCorporationRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("create", () => {
    it("country", async () => {
      const dto = {
        name: "한국",
        englishName: "korea",
        japaneseName: "韓国",
        x: 1,
        y: 2,
      };
      const result = await repository.createCountry(dto);
      expect(result).toMatchObject({
        ...dto,
        id: 1,
      });
    });
    it("corporation", async () => {
      const dto = {
        countryId: 1,
        koreanName: "영진전문대",
        englishName: "yeungjin",
        corporationType: "전문대",
      };
      const result = await repository.createCorporation(dto);
      expect(result).toMatchObject({
        ...dto,
        id: 1,
      });
    });
  });

  describe("update", () => {
    it("country", async () => {
      const dto = {
        name: "대한민국",
        y: 3,
      };
      const result = await repository.updateCountry(dto, 1);
      expect(result).toMatchObject({
        name: "대한민국",
        englishName: "korea",
        japaneseName: "韓国",
        x: 1,
        y: 3,
        id: 1,
      });
    });
    it("corporation", async () => {
      const dto = {
        koreanName: "영진전문대학교",
      };
      const result = await repository.updateCorporation(dto, 1);
      expect(result).toMatchObject({
        countryId: 1,
        koreanName: "영진전문대학교",
        englishName: "yeungjin",
        corporationType: "전문대",
        id: 1,
      });
    });
  });

  describe("delete", () => {
    it("corporation", async () => {
      const result = await repository.deleteCorporation(1);
      expect(result).toBe(true);
      const test = await repository.getAllCorporation();
      expect(test.length).toBe(0);
    });
    it("country", async () => {
      const result = await repository.deleteCountry(1);
      expect(result).toBe(true);
      const test = await repository.getAllCountry();
      expect(test.length).toBe(0);
    });
  });

  describe("create test data", () => {
    it("country", async () => {
      const dtos = [
        {
          name: "한국",
          englishName: "korea",
          japaneseName: "韓国",
          x: 1,
          y: 2,
        },
        {
          name: "일본",
          englishName: "japan",
          japaneseName: "日本",
          x: 1,
          y: 2,
        },
        {
          name: "중국",
          englishName: "china",
          japaneseName: "中国",
          x: 1,
          y: 2,
        },
      ];
      for (const country of dtos) {
        await repository.createCountry(country);
      }
    });
    it("corporation test data", async () => {
      const dtos = [
        {
          countryId: 2,
          koreanName: "영진전문대",
          englishName: "yeungjin",
          corporationType: "전문대",
        },
        {
          countryId: 3,
          koreanName: "영진전문대일본",
          englishName: "yeungjin",
          corporationType: "전문대",
        },
        {
          countryId: 4,
          koreanName: "영진전문대중국",
          englishName: "yeungjin",
          corporationType: "전문대",
        },
      ];
      for (const corporation of dtos) {
        await repository.createCorporation(corporation);
      }
    });
  });
  it("countCountry", async () => {
    const result = await repository.countCountry();
    expect(result).toBe(3);
  });
  it("countCorporation", async () => {
    const result = await repository.countCorporation();
    expect(result).toBe(3);
  });
  it("getCorporationByCountryId", async () => {
    const result = await repository.getCorporationByCountryId(2);
    expect(result).toMatchObject([
      {
        countryId: 2,
        koreanName: "영진전문대",
        englishName: "yeungjin",
        corporationType: "전문대",
      },
    ]);
  });
  it("getAllCorporation", async () => {
    const result = await repository.getAllCorporation();
    expect(result).toMatchObject([
      {
        id: 2,
        countryId: 2,
        koreanName: "영진전문대",
        englishName: "yeungjin",
        corporationType: "전문대",
      },
      {
        id: 3,
        countryId: 3,
        koreanName: "영진전문대일본",
        englishName: "yeungjin",
        corporationType: "전문대",
      },
      {
        id: 4,
        countryId: 4,
        koreanName: "영진전문대중국",
        englishName: "yeungjin",
        corporationType: "전문대",
      },
    ]);
  });
  it("getAllCountry", async () => {
    const result = await repository.getAllCountry();
    expect(result).toMatchObject([
      {
        name: "한국",
        englishName: "korea",
        japaneseName: "韓国",
        x: 1,
        y: 2,
        id: 2,
      },
      {
        name: "일본",
        englishName: "japan",
        japaneseName: "日本",
        x: 1,
        y: 2,
        id: 3,
      },
      {
        name: "중국",
        englishName: "china",
        japaneseName: "中国",
        x: 1,
        y: 2,
        id: 4,
      },
    ]);
  });
});
