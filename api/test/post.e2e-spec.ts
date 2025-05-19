import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { PostOrmEntity } from "src/post/infra/entities/post-orm.entity";
import { PostModule } from "src/post/post.module";
import {
  GetApplicantsResponse,
  GetNewsResponse,
  GetNoticeResponse,
  GetPaginationResponse,
  PostImageUploadResponse,
  PostOKResponse,
  PostOneResponse,
} from "./types/post-response";
import { AttachmentOrmEntity } from "src/post/infra/entities/attachment-orm.entity";
import { PostImageOrmEntity } from "src/post/infra/entities/post-image-orm.entity";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import { ConfigModule } from "@nestjs/config";
import { UserOrmEntity } from "src/users/infra/entities/user.entity";
import { AuthOrmEntity } from "src/auth/infra/entities/auth.entity";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/users/user.module";

describe("PostController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.TEST_DB_HOST,
          port: Number(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USERNAME,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_DATABASE,
          synchronize: true,
          dropSchema: true, // 테스트 후 테이블 초기화
          entities: [
            PostOrmEntity,
            AttachmentOrmEntity,
            PostImageOrmEntity,
            UserOrmEntity,
            AuthOrmEntity,
          ],
        }),
        PostModule,
        AuthModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    // 테스트 서버에 쿠키 설정
    await request(server).post("/auth/register").send({
      name: "관리자",
      email: "user@gmail.com",
      password: "12345678",
    });
    const res = await request(server)
      .post("/auth/login")
      .send({
        email: "user@gmail.com",
        password: "12345678",
      })
      .redirects(0);
    const cookie = res.headers["set-cookie"][0];
    const token = cookie.match(/access_token=([^;]*)/);
    if (token) {
      accessToken = token[1];
    } else {
      throw new Error("access_token not found");
    }
  });

  afterAll(async () => {
    await fs.promises.rm(path.resolve(__dirname, "../../files", "attachment"), {
      recursive: true,
      force: true,
    });
    await fs.promises.rm(path.resolve(__dirname, "../../files", "post-image"), {
      recursive: true,
      force: true,
    });
    await app.close();
  });

  describe("create default posts", () => {
    it("create applicants", async () => {
      const filePath = path.resolve(
        __dirname,
        "__fixtures__",
        "attachment",
        "good",
        "2101080_문성윤_클라우드_네트워크의_구성요소_정리하기.pdf",
      );

      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const resGuidelinesForApplicants = await request(server)
        .post("/post")
        .set("Cookie", [`access_token=${accessToken}`])
        .type("form")
        .field("category", "guidelinesForApplicants")
        .field("title", "guidelinesForApplicants")
        .field(
          "content",
          `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
        )
        .field("language", "korean")
        .attach("files", filePath)
        .attach("files", filePath)
        .expect(201);
      const resApplicants = await request(server)
        .post("/post")
        .set("Cookie", [`access_token=${accessToken}`])
        .type("form")
        .field("category", "applicants")
        .field("title", "applicants")
        .field(
          "content",
          `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
        )
        .field("language", "korean")
        .attach(
          "files",

          path.resolve(
            __dirname,
            "__fixtures__",
            "attachment",
            "good",
            "2101080_문성윤_클라우드_네트워크의_구성요소_정리하기.pdf",
          ),

          {
            filename:
              "2101080_문성윤_클라우드_네트워크의_구성요소_정리하기.pdf",
          },
        )
        .attach(
          "files",

          path.resolve(
            __dirname,
            "__fixtures__",
            "attachment",
            "good",
            "2101080_문성윤_클라우드_네트워크의_구성요소_정리하기.pdf",
          ),

          {
            filename:
              "2101080_문성윤_클라우드_네트워크의_구성요소_정리하기.pdf",
          },
        )
        .expect(201);
      const bodyGuidelinesForApplicants =
        resGuidelinesForApplicants.body as PostOKResponse;

      const bodyApplicants = resApplicants.body as PostOKResponse;

      expect(bodyGuidelinesForApplicants).toMatchObject({
        message: "게시글이 작성되었습니다.",
      });
      expect(bodyApplicants).toMatchObject({
        message: "게시글이 작성되었습니다.",
      });
    });
    it("create news", async () => {
      const server = app.getHttpServer() as unknown as Parameters<
        typeof request
      >[0];
      const resNews1 = await request(server)
        .post("/post")
        .set("Cookie", [`access_token=${accessToken}`])
        .type("form")
        .field("category", "news")
        .field("title", "News1")
        .field(
          "content",
          `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
        )
        .field("language", "korean")
        .expect(201);
      const resNews2 = await request(server)
        .post("/post")
        .set("Cookie", [`access_token=${accessToken}`])
        .type("form")
        .field("category", "news")
        .field("title", "News2")
        .field(
          "content",
          `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
        )
        .field("language", "korean")
        .expect(201);
      const bodyNews1 = resNews1.body as PostOKResponse;

      const bodyNews2 = resNews2.body as PostOKResponse;

      expect(bodyNews1).toMatchObject({
        message: "게시글이 작성되었습니다.",
      });
      expect(bodyNews2).toMatchObject({
        message: "게시글이 작성되었습니다.",
      });
    });
  });

  it("/post/main/applicants (GET) should return applicants and entry", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server).get("/post/main/applicants").expect(200);
    const body = res.body as GetApplicantsResponse;
    expect(body.message).toBe("모집요강과 입학신청서를 불러왔습니다.");
    expect(body.applicants.fileUrl.length).toBeGreaterThan(10);
    expect(typeof body.applicants.fileUrl).toBe("string");
    expect(body.applicants.imageUrl.length).toBeGreaterThan(10);
    expect(typeof body.applicants.imageUrl).toBe("string");
    expect(body.entry.fileUrl.length).toBeGreaterThan(10);
    expect(typeof body.entry.fileUrl).toBe("string");
    expect(body.entry.imageUrl.length).toBeGreaterThan(10);
    expect(typeof body.entry.imageUrl).toBe("string");
  });

  it("/post/search (GET) should return search result", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/post/search?limit=1&page=1&category=news&target=title&word=New")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as GetPaginationResponse;
    expect(body.message).toBe("검색결과를 불러왔습니다.");
    expect(body.data.length).toBe(1);
    expect(body.currentPage).toBe(1);
    expect(body.prevPage).toBeFalsy();
    expect(body.nextPage).toBe(2);
    expect(body.totalPage).toBe(2);
    expect(body.data[0].title).toBe("News2");
  });

  it("/post/main/news (GET) should return news", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/post/main/news")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as GetNewsResponse;
    expect(body.message).toBe("알림을 성공적으로 가져왔습니다.");
    expect(body.data.length).toBe(2);
    expect(body.data[0].imageUrl).toBe("/post/filename1.png");
  });

  it("/post/main/notices (GET) should return notices", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];

    await request(server)
      .post("/post")
      .set("Cookie", [`access_token=${accessToken}`])
      .type("form")
      .field("category", "notice")
      .field("title", "News1")
      .field(
        "content",
        `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
      )
      .field("language", "korean")
      .expect(201);
    await request(server)
      .post("/post")
      .set("Cookie", [`access_token=${accessToken}`])
      .type("form")
      .field("category", "notice")
      .field("title", "News2")
      .field(
        "content",
        `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
      )
      .field("language", "korean")
      .expect(201);

    const res = await request(server)
      .get("/post/main/notices")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as GetNoticeResponse;
    expect(body.message).toBe("공지를 성공적으로 가져왔습니다.");
    expect(body.data.length).toBe(2);
    expect(body.data[0].content).toBe("감사해요");
    expect(typeof body.data[0].date).toBe("string");
    const date = new Date(body.data[0].date);
    const isValidDate = !isNaN(date.getTime());
    expect(isValidDate).toBeTruthy();
  });

  it("/post/:category (GET) should return posts", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/post/applicants")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as GetPaginationResponse;
    expect(body.message).toBe("게시글 목록을 불러왔습니다.");
    expect(body.data.length).toBe(1);
    expect(body.data[0].content).toBe(`<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`);
  });

  it("/post/one/id/:id (GET) should return a post by id", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/post/one/id/1")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as PostOneResponse;
    expect(body.message).toBe("1번 게시글을 불러왔습니다.");
    expect(body.data).toMatchObject({
      title: "guidelinesForApplicants",
      category: "guidelinesForApplicants",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
      language: "korean",
    });
    expect(body.files.length).toBe(2);

    expect(typeof body.files[0].url).toBe("string");
    expect(typeof body.files[1].url).toBe("string");
    expect(typeof body.files[0].originalName).toBe("string");
    expect(typeof body.files[1].originalName).toBe("string");
  });

  it("/post/one/category/:category (GET) should return a post by category", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .get("/post/one/category/guidelinesForApplicants")
      .set("Cookie", ["language=korean"])
      .expect(200);
    const body = res.body as PostOneResponse;
    expect(body.message).toBe(
      "guidelinesForApplicants의 게시글을 불러왔습니다.",
    );
    expect(body.data).toMatchObject({
      title: "guidelinesForApplicants",
      category: "guidelinesForApplicants",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">`,
      language: "korean",
    });
  });

  it("/post/:id (PATCH) should update a post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .patch("/post/1")
      .set("Cookie", [`access_token=${accessToken}`])
      .type("form")
      .field(
        "content",
        `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename6.png" alt="" width="190" height="162">
`,
      )
      .field("language", "korean")
      .expect(200);

    const body = res.body as PostOKResponse;

    expect(body.message).toBe("수정이 완료되었습니다.");

    const test = await request(server).get("/post/one/id/1").expect(200);
    const testBody = test.body as PostOneResponse;
    expect(testBody.data.content).toBe(`<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename6.png" alt="" width="190" height="162">
`);
  });

  it("/post/:id (DELETE) should delete a post", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const res = await request(server)
      .delete("/post/1")
      .set("Cookie", [`access_token=${accessToken}`])
      .expect(200);

    const body = res.body as PostOKResponse;

    expect(body.message).toBe("삭제가 완료되었습니다.");

    await request(server).get("/post/one/id/1").expect(404);
  });

  it("/post/image (POST) should upload image", async () => {
    const server = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];
    const testfilePath = path.join(
      __dirname,
      "__fixtures__",
      "pride",
      "141735.png",
    );
    const res = await request(server)
      .post("/post/image")
      .set("Cookie", [`access_token=${accessToken}`])
      .type("form")
      .attach("image", testfilePath)
      .expect(201);
    const body = res.body as PostImageUploadResponse;
    expect(body.message).toBe("이미지 업로드에 성공했습니다.");
    expect(body.url.length).toBeGreaterThan(0);
  });
});
