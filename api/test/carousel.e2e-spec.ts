import { INestApplication, Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarouselModule } from "src/carousel/carousel.model";
import * as request from "supertest";
import {
  CarouselArrayResponse,
  CarouselOKResponse,
  CarouselResponse,
} from "./types/carousel-response";
import { CarouselOrmEntity } from "src/carousel/infra/entites/carousel.entity";
import * as cookieParser from "cookie-parser";
// import { Carousel } from "src/carousel/domain/entities/carousel.entity";
import * as path from "path";
import * as fs from "fs";

describe("CarouselController (e2e)", () => {
  let app: INestApplication;
  const testfilePath = path.join(__dirname, "../..", "files/141735.png");
  const createdFilePath: string[] = [];
  // const dto: Partial<Carousel> = {
  //   postId: 1,
  //   koreanTitle: "한글",
  //   koreanDescription: "한글설명",
  //   englishTitle: "영어",
  //   englishDescription: "영어설명",
  //   japaneseTitle: "일본어",
  //   japaneseDescription: "일본어설명",
  // };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeOrmModule.forRoot({
        //   type: "sqlite",
        //   database: ":memory:",
        //   entities: [CarouselOrmEntity],
        //   synchronize: true,
        // }),
        TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: true,
          dropSchema: true, // 테스트 후 테이블 초기화
          entities: [CarouselOrmEntity],
        }),
        CarouselModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    //테스트 서버에 cookieParser 적용
    app.use(cookieParser());
    await app.init();
  });
  afterAll(async () => {
    //e2e 테스트로 생성된 파일의 삭제
    await Promise.all(
      createdFilePath.map((item) => {
        fs.promises.unlink(`/files${item}`).catch((e: unknown) => {
          Logger.warn(`파일 삭제 실패: ${item}`, e);
        });
      }),
    );
    await app.close();
  });
  let createdId: number;

  it("/carousel (POST) should create a carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const createRes = await request(server)
      .post("/carousel")
      // .send(dto)
      // .attach(첨부파일)를 사용 -> multipart 형식이므로 .send 대신 .field 사용해야함
      .field("postId", 1)
      .field("koreanTitle", "한글")
      .field("koreanDescription", "한글설명")
      .field("englishTitle", "영어")
      .field("englishDescription", "영어설명")
      .field("japaneseTitle", "일본어")
      .field("japaneseDescription", "일본어설명")
      .attach("file", testfilePath)
      .expect(201); // post 요청 성공 확인
    expect((createRes.body as CarouselOKResponse).message).toBe(
      "작성에 성공했습니다.",
    );
  });

  it("/carousel (GET) should return all carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0]; // 서버 지정

    const res = await request(server)
      .get("/carousel")
      // 쿠키 설정
      .set("Cookie", "language=korean")
      .expect(200);
    const body = res.body as CarouselArrayResponse;
    expect(body.message).toBe("carousel을 불러왔습니다.");
    // data가 []배열인지 확인, %%필요한가?
    expect(Array.isArray(body.data)).toBe(true);
    //길이가 0보다 큰지 확인
    expect(body.data.length).toBeGreaterThan(0);
    //첨부 파일의 이름이 포함된 파일 이름이 image에 있는지 확인.
    expect(body.data[0].image).toContain(`141735.png`);

    if (body.data[0]) {
      // 첫번째로 생성된 열의 id를 저장 (아마 1)
      createdId = body.data[0].id;
    }
    // 생성된 파일 경로를 createdFilePath에 저장
    body.data.map((item) => {
      createdFilePath.push(item.image);
    });
  });
  it("/carousel/:id (GET) should return one carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get(`/carousel/${createdId}`).expect(200);
    expect((res.body as CarouselResponse).data.image).toContain(`141735.png`);
  });

  it("/carousel/:id (PATCH) should update carousel info", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];

    const res = await request(server)
      .patch(`/carousel/${createdId}`)
      .field("koreanTitle", "수정된 한글")
      .expect(200);

    expect((res.body as CarouselResponse).message).toBe(`수정에 성공했습니다.`);
    // 수정 됐는지 확인
    const resTest = await request(server)
      .get(`/carousel/${createdId}`)
      .expect(200);
    const body = resTest.body as CarouselResponse;
    expect(body.data.koreanTitle).toBe("수정된 한글");
  });

  it("/carousel/:id (DELETE) should delete the carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    // 삭제 요청
    await request(server).delete(`/carousel/${createdId}`).expect(200);
    // 확인
    await request(server).get(`/carousel/${createdId}`).expect(400);
  });
});
