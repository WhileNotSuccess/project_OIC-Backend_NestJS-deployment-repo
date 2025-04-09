import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";

describe("UserController (e2e)", () => {
  let app: INestApplication;
  const dto = { name: "1234", email: "1234@gmail.com", password: "4321" };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  // 모든 유저 정보 반환
  it("/users/info (GET) should return all usersInfo", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("users/info").send(dto).expect(200);
    expect(res.body).toBe({});
  });
  // 유저 정보 변경
  it("/users/change (PATCH) should change user table", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const patchRes = await request(server)
      .patch("users/change")
      .send({ name: "5678" })
      .expect(200);
    expect(patchRes.body).toBe({ message: "유저정보 변경에 성공하였습니다." });
  });
  // 관리자 확인
  it("/users/check (GET) should check login user is admin", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("users/check").expect(200);
    expect(res.body).toBe({ result: false });
  });
});
