import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AuthOrmEntity } from "src/auth/infra/entities/auth.entity";
import { UserOrmEntity } from "src/users/infra/entities/user.entity";
import { UserModule } from "src/users/user.module";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as cookieParser from "cookie-parser";
import {
  AdminCheckResponse,
  UserInfoResponse,
  UserResponse,
  UsersInfoResponse,
} from "./types/user.response";
import { ConfigModule } from "@nestjs/config";

describe("Auth & UserController (e2e)", () => {
  let app: INestApplication;

  const userInfo = {
    name: "홍길동",
    email: "hong@example.com",
    password: "12345678",
  };
  const adminInfo = {
    name: "관리자",
    email: "yju.intl@gmail.com",
    password: "Yju_143!",
  };

  let userCookie: string;
  let adminCookie: string;

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
          dropSchema: true,
          entities: [AuthOrmEntity, UserOrmEntity],
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("AuthController", () => {
    it("/auth/register (POST) 회원가입", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const res = await request(server)
        .post("/auth/register")
        .send(userInfo)
        .expect(201);
      await request(server).post("/auth/register").send(adminInfo).expect(201);

      expect((res.body as UserResponse).message).toBe("회원가입되었습니다.");
    });

    it("/auth/login (POST) 로그인 및 쿠키 저장", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      // 일반 유저 토큰 확인
      const res: request.Response = await request(server)
        .post("/auth/login")
        .send({
          email: userInfo.email,
          password: userInfo.password,
        })
        .expect(302); // redirect

      const cookies = res.headers["set-cookie"] as unknown as string[];
      expect(cookies).toBeDefined();

      const accessTokenCookie = cookies.find((c: string) =>
        c.includes("access_token"),
      );
      if (accessTokenCookie) {
        userCookie = accessTokenCookie.split(";")[0]; // access_token=...
      }

      // 관리자 토큰 확인
      const adminRes: request.Response = await request(server)
        .post("/auth/login")
        .send({
          email: adminInfo.email,
          password: adminInfo.password,
        })
        .expect(302); // redirect

      const AdminCookies = adminRes.headers[
        "set-cookie"
      ] as unknown as string[];
      const accessAdminTokenCookie = AdminCookies.find((c: string) =>
        c.includes("access_token"),
      );
      if (accessAdminTokenCookie) {
        adminCookie = accessAdminTokenCookie.split(";")[0];
      }

      expect(accessTokenCookie).toContain("access_token=");
      expect(accessAdminTokenCookie).toContain("access_token=");
    });
  });

  describe("UsersController", () => {
    it("/user (GET) 유저 정보 조회", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const res = await request(server)
        .get("/user")
        .set("Cookie", [userCookie])
        .expect(200);

      expect((res.body as UserInfoResponse).userInfo).toHaveProperty(
        "email",
        userInfo.email,
      );
    });

    it("/user (PATCH) 이름 변경", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const res = await request(server)
        .patch("/user")
        .set("Cookie", [userCookie])
        .send({ name: "아무개" })
        .expect(200);

      const resBody = res.body as UserInfoResponse;
      expect(resBody.message).toBe("이름이 수정되었습니다.");
      expect(resBody.userInfo.name).toBe("아무개");
    });

    it("/user/admin (GET) 일반 유저는 관리자 접근 불가", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      await request(server)
        .get("/user/admin")
        .set("Cookie", [userCookie])
        .expect(401);
    });

    it("/user/admin (GET) - 관리자 권한으로 접근", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const res = await request(server)
        .get("/user/admin")
        .set("Cookie", [adminCookie])
        .expect(200);

      expect((res.body as AdminCheckResponse).result).toBe(true);
    });

    it("/user/users/info (GET) - 관리자만 전체 유저 조회 가능", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const res = await request(server)
        .get("/user/users/info")
        .set("Cookie", [adminCookie])
        .expect(200);

      const resBody = res.body as UsersInfoResponse;
      expect(resBody.data).toBeDefined();
      expect(Array.isArray(resBody.data)).toBe(true);
    });
  });
});
