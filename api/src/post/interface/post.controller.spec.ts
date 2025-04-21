import { Test, TestingModule } from "@nestjs/testing";
import { RequestWithCookies } from "src/common/request-with-cookies";
import { PostController } from "./post.controller";
import { PostService } from "../application/service/post.service";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { Post } from "../domain/entities/post.entity";
import { toSearchTargetEnum } from "src/common/utils/to-search-target-enum";
import { CreatePostDto } from "../application/dto/create-post.dto";
import { UpdatePostDto } from "../application/dto/update-post.dto";
import { Readable } from "typeorm/platform/PlatformTools";

describe("PostController", () => {
  let controller: PostController;
  let service: jest.Mocked<PostService>;
  const date = new Date();
  const dummyPost = new Post(
    "title",
    "content",
    1,
    "category",
    toLanguageEnum("korean"),
    date,
    date,
    1,
  );
  const mockRequest = {
    cookies: { language: "korean" },
  } as unknown as RequestWithCookies;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneForId: jest.fn(),
            findOneForCategory: jest.fn(),
            findApplicant: jest.fn(),
            findNews: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            search: jest.fn(),
            uploadImage: jest.fn(),
            findNotice: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get(PostService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getApplicants", () => {
    it("should return message, applicants, entry", async () => {
      service.findApplicant.mockResolvedValue({
        applicants: {
          imageUrl: "string",
          fileUrl: "string",
        },
        entry: {
          imageUrl: "string",
          fileUrl: "string",
        },
      });
      const result = await controller.getApplicants();
      expect(result).toMatchObject({
        message: "모집요강과 입학신청서를 불러왔습니다.",
        applicants: {
          imageUrl: "string",
          fileUrl: "string",
        },
        entry: {
          imageUrl: "string",
          fileUrl: "string",
        },
      });
    });
  });
  describe("search", () => {
    it("should return search result", async () => {
      service.search.mockResolvedValue({
        data: [dummyPost],
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 10,
      });

      const result = await controller.search(
        mockRequest,
        1,
        2,
        "category",
        toSearchTargetEnum("title"),
        "hello",
      );
      expect(service.search).toHaveBeenCalledWith(
        "title",
        "hello",
        "korean",
        "category",
        2,
        1,
      );
      expect(result).toMatchObject({
        message: "검색결과를 불러왔습니다.",
        data: [
          {
            title: "title",
            content: "content",
            userId: 1,
            category: "category",
            language: "korean",
            id: 1,
          },
        ],
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 10,
      });
    });
  });
  describe("getNews", () => {
    it("should return news", async () => {
      service.findNews.mockResolvedValue([
        {
          postId: 1,
          imageUrl: "https://example.com/api/files/hello.png",
          title: "게시글 제목",
        },
      ]);

      const result = await controller.getNews(mockRequest);
      expect(service.findNews).toHaveBeenCalledWith("korean");
      expect(result).toMatchObject({
        message: "알림을 성공적으로 가져왔습니다.",
        data: [
          {
            postId: 1,
            imageUrl: "https://example.com/api/files/hello.png",
            title: "게시글 제목",
          },
        ],
      });
    });
  });

  describe("getNotice", () => {
    it("should return notices", async () => {
      service.findNotice.mockResolvedValue([
        {
          postId: 1,
          content: "https://example.com/api/files/hello.png",
          title: "게시글 제목",
        },
      ]);

      const result = await controller.getNotices(mockRequest);
      expect(service.findNotice).toHaveBeenCalledWith("korean");
      expect(result).toMatchObject({
        message: "공지를 성공적으로 가져왔습니다.",
        data: [
          {
            postId: 1,
            content: "https://example.com/api/files/hello.png",
            title: "게시글 제목",
          },
        ],
      });
    });
  });
  describe("create", () => {
    it("should create post", async () => {
      const dto: CreatePostDto = {
        title: "korean",
        content: "korean",
        language: toLanguageEnum("korean"),
        category: "korean",
      };
      const files: Express.Multer.File[] = [];
      const result = await controller.create(dto, files);
      expect(service.create).toHaveBeenCalledWith(dto, 1, []);
      expect(result).toMatchObject({
        message: "게시글이 작성되었습니다.",
      });
    });
  });
  describe("findAll", () => {
    it("should return pagination", async () => {
      service.findAll.mockResolvedValue({
        data: [dummyPost],
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 10,
      });

      const result = await controller.findAll("category", 10, 2, mockRequest);
      expect(service.findAll).toHaveBeenCalledWith("category", 2, 10, "korean");
      expect(result).toMatchObject({
        message: "게시글 목록을 불러왔습니다.",
        data: [
          {
            title: "title",
            content: "content",
            userId: 1,
            category: "category",
            language: "korean",
            id: 1,
          },
        ],
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 10,
      });
    });
  });
  describe("findOneForId", () => {
    it("should return one post", async () => {
      service.findOneForId.mockResolvedValue({
        post: dummyPost,
        files: [],
      });
      const result = await controller.findOneForId("1");
      expect(service.findOneForId).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        message: `1번 게시글을 불러왔습니다.`,
        data: dummyPost,
        files: [],
      });
    });
  });
  describe("findOneForCategory", () => {
    it("should return one post", async () => {
      service.findOneForCategory.mockResolvedValue(dummyPost);
      const result = await controller.findOneForCategory(
        "category",
        mockRequest,
      );
      expect(service.findOneForCategory).toHaveBeenCalledWith(
        "category",
        "korean",
      );
      expect(result).toMatchObject({
        message: `category의 게시글을 불러왔습니다.`,
        data: dummyPost,
      });
    });
  });
  describe("update", () => {
    it("should update post", async () => {
      const dto: UpdatePostDto = {
        title: "korean",
        content: "korean",
        language: toLanguageEnum("korean"),
        category: "korean",
        deleteFilePath: "[]",
      };
      const result = await controller.update("1", dto, []);
      expect(service.update).toHaveBeenCalledWith(1, dto, []);
      expect(result).toMatchObject({
        message: "수정이 완료되었습니다.",
      });
    });
  });
  describe("remove", () => {
    it("should remove post", async () => {
      service.remove.mockResolvedValue(true);
      const result = await controller.remove("1");
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        message: "삭제가 완료되었습니다.",
      });
    });
  });

  describe("upload image", () => {
    it("should save image and return url", async () => {
      const dummyImage: Express.Multer.File = {
        fieldname: "",
        originalname: "",
        encoding: "",
        mimetype: "",
        size: 0,
        stream: new Readable(),
        destination: "",
        filename: "",
        path: "",
        buffer: Buffer.from("fake image content"),
      };
      service.uploadImage.mockResolvedValue("hello.png");
      const result = await controller.uploadImage([dummyImage]);
      expect(result).toMatchObject({
        message: "이미지 업로드에 성공했습니다.",
        url: "hello.png",
      });
      expect(service.uploadImage).toHaveBeenCalledWith(dummyImage);
    });
  });
});
