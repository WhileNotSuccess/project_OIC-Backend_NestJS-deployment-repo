import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { StaffModule } from "src/staff/staff.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffOrmEntity } from "src/staff/infra/entities/staff.entity";
import {
  StaffResMessage,
  StaffResMessageForAdmin,
} from "./types/staff-response";
import * as cookieParser from "cookie-parser";

describe("StaffController (e2e)", () => {
  let app: INestApplication;
  const staff = [
    {
      name: "홍길동",
      position: "대장",
      phone: "01012345678",
      email: "hello@hello.com",
      team: "팀1",
      position_jp: "頭",
      team_jp: "チーム1",
      position_en: "head",
      team_en: "team1",
      role: "총괄",
      role_en: "all",
      role_jp: "全部",
    },
    {
      name: "홍길은",
      position: "대장",
      phone: "01012345678",
      email: "hello@hello.com",
      team: "팀1",
      position_jp: "頭",
      team_jp: "チーム1",
      position_en: "head",
      team_en: "team1",
      role: "총괄",
      role_en: "all",
      role_jp: "全部",
    },
    {
      name: "홍길금",
      position: "대장",
      phone: "01012345678",
      email: "hello@hello.com",
      team: "팀2",
      position_jp: "頭",
      team_jp: "チーム2",
      position_en: "head",
      team_en: "team2",
      role: "총괄",
      role_en: "all",
      role_jp: "全部",
    },
    {
      name: "홍길플",
      position: "대장",
      phone: "02022345678",
      email: "hello@hello.com",
      team: "팀2",
      position_jp: "頭",
      team_jp: "チーム2",
      position_en: "head",
      team_en: "team2",
      role: "총괄",
      role_en: "all",
      role_jp: "全部",
    },
  ];
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
          entities: [StaffOrmEntity],
        }),
        StaffModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/staff (POST) should create a staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    await request(server).post("/staff").send(staff[0]).expect(201);
    await Promise.all(
      staff.map(async (item) => {
        return await request(server).post("/staff").send(item).expect(201);
      }),
    );
  });

  it("/staff (GET) should return all staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/staff")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body: StaffResMessage = res.body as StaffResMessage;

    expect(Array.isArray(body.data["팀1"])).toBe(true);

    expect(body.data["팀1"].length).toBeGreaterThan(0);

    const resJP = await request(server)
      .get("/staff")
      .set("Cookie", ["language=japanese"])
      .expect(200);
    const bodyJP: StaffResMessage = resJP.body as StaffResMessage;

    expect(Array.isArray(bodyJP.data["チーム1"])).toBe(true);

    expect(bodyJP.data["チーム1"].length).toBeGreaterThan(0);

    const resEN = await request(server)
      .get("/staff")
      .set("Cookie", ["language=english"])
      .expect(200);
    const bodyEN: StaffResMessage = resEN.body as StaffResMessage;

    expect(Array.isArray(bodyEN.data["team1"])).toBe(true);

    expect(bodyEN.data["team1"].length).toBeGreaterThan(0);
  });

  it("/staff/admin (GET) should return all staff with all language", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/staff/admin").expect(200);
    const body: StaffResMessageForAdmin = res.body as StaffResMessageForAdmin;

    expect(Array.isArray(body.data["팀1"])).toBe(true);

    expect(body.data["팀1"].length).toBe(3);
    expect(body.data["팀2"].length).toBe(2);
  });

  it("/staff/:id (PATCH) should update staff info", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];

    await request(server).patch(`/staff/1`).send({ role: "staff" }).expect(200);

    const test = await request(server)
      .get("/staff")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const testBody = test.body as StaffResMessage;
    expect(testBody.data["팀1"][0]).toMatchObject({
      name: "홍길동",
      position: "대장",
      phone: "01012345678",
      email: "hello@hello.com",
      team: "팀1",
      role: "staff",
    });
  });

  it("/staff/:id (DELETE) should delete the staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    await request(server).delete(`/staff/1`).expect(200);

    await request(server).get(`/staff/1`).expect(404);
  });
});
