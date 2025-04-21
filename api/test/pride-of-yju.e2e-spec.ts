import { INestApplication, Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as cookieParser from "cookie-parser";
import * as request from "supertest";
import {
  PrideOfYjuArrayResponse,
  PrideOfYjuOKResponse,
  PrideOfYjuResponse,
} from "./types/pride-of-yju.response";
import * as path from "path";
import * as fs from "fs";
import { PrideOfYjuOrmEntity } from "src/pride-of-yju/infra/entities/pride-of-yju.entity";
import { PrideOfYjuModule } from "src/pride-of-yju/pride-of-yju.module";

describe("PrideOfYjuController (e2e)", () => {
  let app: INestApplication;
  const testfilePath = path.join(
    __dirname,
    "__fixtures__",
    "pride",
    "141735.png",
  );

  // const dto: Partial<PrideOfYju> = {
  //   image: "pride/123456-789012.jpg",
  //   Korean: "한국어",
  //   English: "영어",
  //   Japanese: "일본어",
  // };
  beforeAll(async () => {
    // module 생성, 데이터베이스 생성
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeOrmModule.forRoot({
        //   type: "sqlite",
        //   database: ":memory:",
        //   entities: [PrideOfYjuOrmEntity],
        //   synchronize: true,
        // }),
        TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.TEST_DB_HOST,
          port: Number(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USERNAME,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_DATABASE,
          synchronize: true,
          dropSchema: true, // 테스트 후 테이블 초기화
          entities: [PrideOfYjuOrmEntity],
        }),
        PrideOfYjuModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });
  afterAll(async () => {
    //e2e 테스트로 생성된 파일의 삭제

    try {
      await fs.promises.rm("/files/pride", { recursive: true, force: true });
    } catch (e) {
      Logger.warn(`파일 삭제 실패: `, e);
    }


    await app.close();
  });
  let createdId: number;

  it("/pride (POST) should create a pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .post("/pride")
      // .send(dto)
      // .attach(첨부파일)를 사용 -> multipart 형식이므로 .send 대신 .field 사용해야함
      .field("Korean", "한국어")
      .field("English", "영어")
      .field("Japanese", "일본어")
      .attach("file", testfilePath)
      .expect(201);
    expect((res.body as PrideOfYjuOKResponse).message).toBe(
      "PridOfYju 작성에 성공했습니다.",
    );
  });

  it("/pride (GET) should return all pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    // 요청
    const res = await request(server).get("/pride").expect(200);
    const body = res.body as PrideOfYjuArrayResponse;
    // 비교 실행
    expect(body.message).toBe("pride of yju를 불러왔습니다.");
    expect(body.data[0].image).toContain(`141735.png`);
    expect(body.data.length).toBeGreaterThan(0);
    // 생성된 열 id 저장(아마 1)
    createdId = body.data[0].id;
  });

  it("/pride/:id (GET) should return one pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    // 요청후 비교
    const res = await request(server).get(`/pride/${createdId}`).expect(200);
    expect((res.body as PrideOfYjuResponse).data.Korean).toBe("한국어");
  });

  it("/pride (PATCH) should update one pride-of-yju", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    // patch 요청
    const res = await request(server)
      .patch(`/pride/${createdId}`)
      .send({ Korean: "수정된 한국어" })
      .expect(200);
    expect((res.body as PrideOfYjuResponse).message).toBe(
      "PridOfYju 수정에 성공했습니다.",
    );
    // get 요청으로 확인
    const getRes = await request(server).get(`/pride/${createdId}`).expect(200);
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
      "PridOfYju 삭제에 성공했습니다.",
    );
    await request(server).get(`/pride/${createdId}`).expect(404);
  });
});
