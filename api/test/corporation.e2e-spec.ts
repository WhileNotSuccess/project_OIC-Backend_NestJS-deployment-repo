import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CorporationModule } from "src/corporation/corporation.module";
import { CorporationOrmEntity } from "src/corporation/infra/entities/corporation.entity";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import {
  CountryNamesResponse,
  CorporationResponse,
  MessageResponse,
} from "./types/corporation.response";
import { CountryOrmEntity } from "src/corporation/infra/entities/country.entity";

describe("CorporationController (e2e)", () => {
  const createCorporationDTOs = [
    {
      countryId: 1,
      koreanName: "영진전문대한국1",
      englishName: "yeungjinKorea1",
      corporationType: "전문대학",
    },
    {
      countryId: 2,
      koreanName: "영진전문대일본1",
      englishName: "yeungjinJapan1",
      corporationType: "전문대학",
    },
    {
      countryId: 3,
      koreanName: "영진전문대중국1",
      englishName: "yeungjinChina1",
      corporationType: "전문대학",
    },
    {
      countryId: 1,
      koreanName: "영진전문대한국2",
      englishName: "yeungjinKorea2",
      corporationType: "전문대학",
    },
    {
      countryId: 2,
      koreanName: "영진전문대일본2",
      englishName: "yeungjinJapan2",
      corporationType: "전문대학",
    },
    {
      countryId: 3,
      koreanName: "영진전문대중국2",
      englishName: "yeungjinChina2",
      corporationType: "전문대학",
    },
  ];
  const createCountryDTOs = [
    {
      name: "한국",
      englishName: "korea",
      japaneseName: "韓国",
      x: 1,
      y: 1,
    },
    {
      name: "일본",
      englishName: "japan",
      japaneseName: "日本",
      x: 1,
      y: 1,
    },
    {
      name: "중국",
      englishName: "china",
      japaneseName: "中国",
      x: 1,
      y: 1,
    },
  ];
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.TEST_DB_HOST,
          port: Number(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USERNAME,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_DATABASE,
          synchronize: true,
          dropSchema: true, // 테스트 후 테이블 초기화
          entities: [CorporationOrmEntity, CountryOrmEntity],
        }),
        CorporationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("create corporation", () => {
    // 나라 생성
    it("create test country", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];

      for (const country of createCountryDTOs) {
        const result = await request(server)
          .post("/corporation/country")
          .send(country)
          .expect(201);
        const body = result.body as MessageResponse;
        expect(body).toMatchObject({
          message: "생성이 완료되었습니다.",
        });
      }
    });
    // 기관 생성
    it("create test corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];

      for (const corporation of createCorporationDTOs) {
        const result = await request(server)
          .post("/corporation/corporation")
          .send(corporation)
          .expect(201);
        const body = result.body as MessageResponse;
        expect(body).toMatchObject({
          message: "생성이 완료되었습니다.",
        });
      }
    });
  });
  describe("update corporation", () => {
    it("update first corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      // 기관 정보 수정
      const result = await request(server)
        .patch("/corporation/corporation/1")
        .send({ koreanName: "영진전문대학교" })
        .expect(200);
      const resultBody = result.body as MessageResponse;

      expect(resultBody).toMatchObject({
        message: "수정이 완료되었습니다.",
      });
      // 정보 불러와서 수정되었는지 확인
      const test = await request(server)
        .get("/corporation?country=한국")
        .set("Cookie", ["language=korean"])
        .expect(200);

      const body = test.body as CorporationResponse;

      expect(body.message).toBe("한국 협약기관 목록을 불러왔습니다.");
      expect(body.data[0]).toMatchObject({
        name: "영진전문대학교",
        corporationType: "전문대학",
      });
    });
    it("update first country", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      // 한국을 대한민국으로 수정
      const result = await request(server)
        .patch("/corporation/country/1")
        .send({ name: "대한민국" })
        .expect(200);
      const resultBody = result.body as MessageResponse;
      expect(resultBody).toMatchObject({
        message: "수정이 완료되었습니다.",
      });
      // 수정되었는지 확인
      const test = await request(server)
        .get("/corporation/countries")
        .set("Cookie", ["language=korean"])
        .expect(200);

      const body = test.body as CountryNamesResponse;

      expect(body.message).toBe("나라 목록을 불러왔습니다.");
      expect(body.data[0]).toMatchObject({
        id: 1,
        name: "대한민국",
        x: 1,
        y: 1,
      });
    });
  });
  describe("delete corporation", () => {
    it("delete last corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      // 가장 마지막에 추가된 기관 삭제
      const result = await request(server)
        .delete(`/corporation/corporation/${createCorporationDTOs.length}`)
        .expect(200);
      const resultBody = result.body as MessageResponse;

      expect(resultBody).toMatchObject({
        message: "삭제가 완료되었습니다.",
      });

      const testKorean = await request(server)
        .get("/corporation?country=대한민국")
        .set("Cookie", ["language=korean"])
        .expect(200);
      const testJapan = await request(server)
        .get("/corporation?country=일본")
        .set("Cookie", ["language=korean"])
        .expect(200);
      const testChina = await request(server)
        .get("/corporation?country=중국")
        .set("Cookie", ["language=korean"])
        .expect(200);
      const bodyKorean = testKorean.body as CorporationResponse;
      const bodyJapan = testJapan.body as CorporationResponse;
      const bodyChina = testChina.body as CorporationResponse;

      expect(bodyKorean.message).toBe("대한민국 협약기관 목록을 불러왔습니다.");
      // 하나 삭제되었는지 확인
      expect(
        bodyKorean.data.length + bodyJapan.data.length + bodyChina.data.length,
      ).toBe(createCorporationDTOs.length - 1);
    });
    it("delete last country", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      // 삭제용 나라 추가
      await request(server)
        .post("/corporation/country")
        .send(createCountryDTOs[0])
        .expect(201);
      // 추가 됐는지 확인
      const result = await request(server)
        .get("/corporation/countries")
        .set("Cookie", ["language=korean"])
        .expect(200);
      const createdBody = result.body as CountryNamesResponse;
      expect(createdBody.data.length).toBe(createCountryDTOs.length + 1);
      // 삭제 요청
      const deleteTest = await request(server)
        .delete(`/corporation/country/${createCountryDTOs.length + 1}`)
        .expect(200);

      const body = deleteTest.body as MessageResponse;
      expect(body).toMatchObject({
        message: "삭제가 완료되었습니다.",
      });
      // 삭제 되었는지 확인
      const deleteResult = await request(server)
        .get("/corporation/countries")
        .set("Cookie", ["language=korean"])
        .expect(200);
      const deletedBody = deleteResult.body as CountryNamesResponse;
      expect(deletedBody.data.length).toBe(createCountryDTOs.length);
    });
  });

  describe("get countries", () => {
    it("get countries name", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const result = await request(server)
        .get(`/corporation/countries`)
        .set("Cookie", ["language=english"])
        .expect(200);
      const body = result.body as CountryNamesResponse;
      // 나라 이름과 아이디, 좌표값이 잘 받아와지는지 확인
      expect(new Set(body.data)).toMatchObject(
        new Set([
          {
            id: 1,
            name: "korea",
            x: 1,
            y: 1,
          },
          {
            id: 2,
            name: "japan",
            x: 1,
            y: 1,
          },
          {
            id: 3,
            name: "china",
            x: 1,
            y: 1,
          },
        ]),
      );
    });
  });
});
