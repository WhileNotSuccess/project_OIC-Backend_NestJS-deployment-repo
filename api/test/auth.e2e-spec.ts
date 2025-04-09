import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { AuthResponse } from "./types/auth-response";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  const dto = {
    name: "1234",
    email: "1234@gmail.com",
    password: "1234",
  };

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
  //구글 리다이렉트 - 테스트 없음?

  //회원가입
  it("/auth/signin (POST) user signin", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .post("auth/google/signin")
      .send(dto)
      .expect(201);
    expect(res.body as AuthResponse).toBe({
      message: "회원가입 되었습니다.",
    });
  });
  //로그인
  it("/auth/login (POST) user login", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .post("/auth/google/login")
      .send({ email: dto.email, password: dto.password })
      .expect(201);
    expect(res.body as AuthResponse).toBe({ message: "로그인 되었습니다." });
  });
  //구글 로그인, 회원가입
  it("/auth/google/login (POST) new user google login, signin", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).post("/auth/google/login").expect(201);
    expect(res.body as AuthResponse).toBe({
      message: "구글 계정으로 로그인 되었습니다.",
    });
  });
  //구글 연동
  it("/auth/google/link (POST) already user done signin link google account", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).post("/auth/google/link").expect(201);
    expect(res.body as AuthResponse).toBe({
      message: "구글 계정과 연동되었습니다.",
    });
  });
});
