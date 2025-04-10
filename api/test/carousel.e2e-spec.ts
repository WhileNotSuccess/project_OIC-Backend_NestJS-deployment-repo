import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarouselModule } from "src/carousel/carousel.model";
import * as request from "supertest";
import {
  CarouselArrayResponse,
  CarouselResponse,
} from "./types/carousel-response";
import { CarouselOrmEntity } from "src/carousel/infra/entites/carousel.entity";
import cookieParser from "cookie-parser";

describe("CarouselController (e2e)", () => {
  let app: INestApplication;
  const dto: Partial<CarouselResponse["data"]> = {
    image: "carousel/203846-92082392.jpg",
    postId: 1,
    KoreanTitle: "한글",
    KoreanDescription: "한글설명",
    EnglishTitle: "영어",
    EnglishDescription: "영어설명",
    JapaneseTitle: "일본어",
    JapaneseDescription: "일본어설명",
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

  it("/carousel (POST) should create a carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const createRes = await request(server)
      .post("/carousel")
      .send(dto)
      .expect(201); // post 요청 성공 확인
    expect((createRes.body as CarouselResponse).message).toBe(
      "작성에 성공했습니다.",
    );
  });

  it("/carousel (GET) should return all carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0]; // 서버 지정
    // document.cookie = "language=korean;path=/"; // 쿠키 설정
    // const cookies = document.cookie;
    // expect(cookies).toContain("language=korean"); // 쿠키가 설정됐는지 확인

    const res = await request(server)
      .get("/carousel")
      .set("Cookie", "language=korean")
      .expect(200); // get 요청 보내기
    const body = res.body as CarouselArrayResponse;
    expect(body.message).toBe("carousel을 전부 불러왔습니다.");
    expect(Array.isArray(body.data)).toBe(true); // data가 []배열인지 확인
    expect(body.data.length).toBeGreaterThan(0); //길이가 0보다 큰지 확인
    if (body.data[0]) {
      createdId = body.data[0].id; // 첫번째로 생성된 열의 id를 저장
      console.log(body.data);
    }

    // const body = res.body as CarouselArrayResponse["data"];
    // const bodyData = body.data as CarouselResponse["data"][]; // 받은 응답의 body 추출

    // if (bodyData[0]) {
    //   createdId = bodyData[0]?.id;
    // }

    // expect(Array.isArray(bodyData)).toBe(true); // body가 []배열인지 확인

    // expect(body.length).toBeGreaterThan(0); // body의 길이가 0보다 큰지 확인
  });

  it("/carousel/:id (PATCH) should update carousel info", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .patch(`/carousel/${createdId}`)
      .send({
        KoreanTitle: "수정된 한글",
      })
      .expect(200);

    expect((res.body as CarouselResponse).message).toBe(
      `${createdId}번의 carousel을 수정하였습니다.`,
    );
    const resTest = await request(server)
      .get(`/carousel/${createdId}`)
      .expect(200);
    const body = resTest.body as CarouselResponse;
    if (body.data) {
      expect(body.data.KoreanTitle).toBe("수정된 한글");
    }
  });

  it("/carousel/:id (DELETE) should delete the carousel", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    await request(server).delete(`/carousel/${createdId}`).expect(200);
    await request(server).get(`/carousel/${createdId}`).expect(404);
  });
});
