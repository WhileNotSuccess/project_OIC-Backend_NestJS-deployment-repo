import { INestApplication, InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CorporationModule } from "src/corporation/corporation.module";
import { CorporationOrmEntity } from "src/corporation/infra/entities/corporation.entity";
import * as request from "supertest";
import * as cookieParser from "cookie-parser";
import {
  CorporationNamesResponse,
  CorporationResponse,
} from "./types/corporation.response";

describe("CorporationController (e2e)", () => {
  const corporation = [
    {
      country: "한국",
      koreanName: "영진전문대",
      englishName: "yeungjin",
      corporationType: "전문대학",
      x: 1,
      y: 1,
    },
    {
      country: "일본",
      koreanName: "영진전문대",
      englishName: "yeungjin",
      corporationType: "전문대학",
      x: 1,
      y: 1,
    },
    {
      country: "중국",
      koreanName: "영진전문대",
      englishName: "yeungjin",
      corporationType: "전문대학",
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
          entities: [CorporationOrmEntity],
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
    it("create a test corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const result = await request(server)
        .post("/corporation")
        .send(corporation[0])
        .expect(201);
      expect(result.body).toMatchObject({
        message: "생성이 완료되었습니다.",
      });

      await Promise.all(
        corporation.map(async (item) => {
          return await request(server)
            .post("/corporation")
            .send(item)
            .expect(200);
        }),
      );
    });
  });
  describe("update corporation", () => {
    it("update first corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const result = await request(server)
        .patch("/corporation/1")
        .send({ koreanName: "영진전문대학교" })
        .expect(200);

      expect(result).toMatchObject({
        message: "수정이 완료되었습니다.",
      });

      const test = await request(server)
        .get("/corporation?country=한국")
        .expect(200);

      const body = test.body as CorporationResponse;

      expect(body.message).toBe("한국 협약기관 목록을 불러왔습니다.");
      expect(body.data[0]).toMatchObject({
        country: "한국",
        koreanName: "영진전문대학교",
        englishName: "yeungjin",
        corporationType: "전문대학",
        x: 1,
        y: 1,
      });
    });
  });
  describe("delete corporation", () => {
    let targetId: number;
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    it("get id for test", async () => {
      const result = await request(server)
        .get("/corporation?country=일본")
        .expect(200);
      const body = result.body as CorporationResponse;
      if (!body.data[0].id) {
        throw new InternalServerErrorException("테스트 중 실패");
      }
      targetId = body.data[0].id;
    });
    it("check delete", async () => {
      const result = await request(server)
        .delete(`/corporation/${targetId}`)
        .expect(200);
      expect(result.body).toMatchObject({
        message: "삭제가 완료되었습니다.",
      });

      const test = await request(server)
        .get("/corporation?country=일본")
        .expect(200);
      const body = test.body as CorporationResponse;
      expect(body.data.length).toBe(0);
    });
  });
  describe("get corporation's country and coordinate", () => {
    it("get korea corporation", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const result = await request(server)
        .get(`/corporation?country=한국`)
        .expect(200);
      const body = result.body as CorporationResponse;
      expect(body.data).toMatchObject([
        {
          country: "한국",
          koreanName: "영진전문대학교",
          englishName: "yeungjin",
          corporationType: "전문대학",
          x: 1,
          y: 1,
        },
        {
          country: "한국",
          koreanName: "영진전문대",
          englishName: "yeungjin",
          corporationType: "전문대학",
          x: 1,
          y: 1,
        },
      ]);
    });
  });
  describe("get countries", () => {
    it("get countries name", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const result = await request(server)
        .get(`/corporation/countries`)
        .expect(200);
      const body = result.body as CorporationNamesResponse;

      expect(new Set(body.data)).toContain(new Set(["한국", "중국"]));
    });
  });
});
