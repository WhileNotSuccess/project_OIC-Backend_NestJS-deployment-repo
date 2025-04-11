import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as cookieParser from "cookie-parser";
import * as request from "supertest";
import { CarouselModule } from "src/carousel/carousel.model";
import { CarouselOrmEntity } from "src/carousel/infra/entites/carousel.entity";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import {
  PrideOfYjuArrayResponse,
  PrideOfYjuResponse,
} from "./types/pride-of-yju.response";

describe("PrideOfYjuController (e2e)", () => {
  let app: INestApplication;
  const dto: Partial<PrideOfYju> = {
    image: "pride/123456-789012.jpg",
    Korean: "한국어",
    English: "영어",
    Japanese: "일본어",
  };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [CarouselOrmEntity],
          synchronize: true,
        }),
        CarouselModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  let createdId: number;
  it("/pride (POST) should create a pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).post("/pride").send(dto).expect(201);
    expect((res.body as PrideOfYjuResponse).message).toBe(
      "작성에 성공했습니다.",
    );
  });

  it("/pride (GET) should return all pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/pride").expect(201);
    const body = res.body as PrideOfYjuArrayResponse;
    expect(body.message).toBe("pride of yju를 불러왔습니다.");
    expect(body.data).toBeGreaterThan(0);
    createdId = body.data[0].id;
  });
  it("/pride/:id (GET) should return one pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get(`/pride/${createdId}`).expect(201);
    expect((res.body as PrideOfYjuResponse).message).toBe("");
  });
  it("/pride (PATCH) should update one pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .patch(`/pride/${createdId}`)
      .send({ Korean: "수정된 한국어" })
      .expect(200);
    expect((res.body as PrideOfYjuResponse).message).toBe(
      "수정에 성공했습니다.",
    );
    const getRes = await request(server).get(`/pride/${createdId}`).expect(201);
    expect((getRes.body as PrideOfYjuResponse).data?.Korean).toBe(
      "수정된 한국어",
    );
  });
  it("/pride (DELETE) should delete one pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).delete(`/pride/${createdId}`).expect(200);
    expect((res.body as PrideOfYjuResponse).message).toBe(
      "삭제에 성공했습니다.",
    );
    await request(server).get(`/pride/${createdId}`).expect(404);
  });
});
