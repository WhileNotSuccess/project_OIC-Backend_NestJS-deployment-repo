import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { StaffModule } from "src/staff/staff.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffOrmEntity } from "src/staff/infra/entities/staff.entity";
import { StaffResMessage, StaffResponse } from "./types/staff-response";

describe("StaffController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [StaffOrmEntity],
          synchronize: true,
        }),
        StaffModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  it("/staff (POST) should create a staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .post("/staff")
      .send({ name: "홍길동", phoneNumber: "01012345678", role: "admin" })
      .expect(201);

    const body: StaffResponse = res.body as StaffResponse;
    createdId = body.id;

    expect(res.body).toMatchObject({
      name: "홍길동",
      phoneNumber: "01012345678",
      role: "admin",
    });
  });

  it("/staff (GET) should return all staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/staff").expect(200);
    const body: StaffResMessage = res.body as StaffResMessage;

    expect(Array.isArray(body.data)).toBe(true);

    expect(body.data).toBeGreaterThan(0);
  });

  it("/staff/:id (GET) should return one staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get(`/staff/${createdId}`).expect(200);

    const body: StaffResponse = res.body as StaffResponse;

    expect(body.id).toBe(createdId);
    expect(body.name).toBe("홍길동");
  });

  it("/staff/:id (PATCH) should update staff info", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .patch(`/staff/${createdId}`)
      .send({ role: "staff" })
      .expect(200);
    const body: StaffResponse = res.body as StaffResponse;

    expect(body.role).toBe("staff");
  });

  it("/staff/:id (DELETE) should delete the staff", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    await request(server).delete(`/staff/${createdId}`).expect(200);

    await request(server).get(`/staff/${createdId}`).expect(404);
  });
});
