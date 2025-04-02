import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { PostOrmEntity } from "src/post/infra/entities/post-orm.entity";
import { PostModule } from "src/post/post.module";
import {
  PostArrayResponse,
  PostOKResponse,
  PostOneResponse,
} from "./types/post-response";

describe("PostController (e2e)", () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [PostOrmEntity],
          synchronize: true,
        }),
        PostModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/post (POST) should create a post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .post("/post")
      .send({ title: "제목1", content: "<p>안녕하세요</p>", author: "관리자" })
      .expect(201);

    const body = res.body as PostOKResponse;
    expect(body).toMatchObject({
      message: "게시글이 작성되었습니다.",
    });
  });

  it("/post (GET) should return all post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/post").expect(200);
    const body = res.body as PostArrayResponse;
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.message).toBe("게시글 목록을 불러왔습니다.");
  });

  it("/post/:id (GET) should return one post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/post/1").expect(200);
    const body = res.body as PostOneResponse;
    expect(body.data).toMatchObject({
      title: "제목1",
      content: "<p>안녕하세요</p>",
      author: "관리자",
    });
    expect(body.message).toBe("1번 게시글을 불러왔습니다.");
  });
  it("/post/:id (PATCH) should update post data", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).patch("/post/1").send({
      title: "제목2",
      content: "<p>안녕하세요1</p>",
      author: "관리자1",
    });
    const body = res.body as PostOKResponse;
    expect(body.message).toBe("수정이 완료되었습니다.");

    const resGet = await request(server).get("/post/1").expect(200);
    const getBody = resGet.body as PostOneResponse;
    expect(getBody.data).toMatchObject({
      title: "제목2",
      content: "<p>안녕하세요1</p>",
      author: "관리자1",
    });
    expect(getBody.message).toBe("1번 게시글을 불러왔습니다.");
  });

  it("/post/:id (DELETE) should delete the post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).delete("/post/1").expect(200);
    const body = res.body as PostOKResponse;
    expect(body.message).toBe("삭제가 완료되었습니다.");
    await request(server).get("/post/1").expect(404);
  });
});
