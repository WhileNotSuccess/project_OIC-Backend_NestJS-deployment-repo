import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { Post } from "src/post/domain/entities/post.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { MediaService } from "src/media/domain/media.service";
import { Readable } from "stream";
import { News } from "src/post/domain/types/news";
import { UpdatePostDto } from "../dto/update-post.dto";
import { toSearchTargetEnum } from "src/common/utils/to-search-target-enum";

describe("PostService", () => {
  let service: PostService;
  let repository: jest.Mocked<PostRepository>;
  let media: MediaService;
  let postsPagination: Post[];
  let news: News[];
  const testingPosts: CreatePostDto[] = [
    {
      title: "안녕",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
`,
      language: toLanguageEnum("korean"),
      category: "news",
    },
    {
      title: "안녕1",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
`,
      language: toLanguageEnum("korean"),
      category: "news",
    },
    {
      title: "안녕2",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
`,
      language: toLanguageEnum("korean"),
      category: "news",
    },
    {
      title: "안녕3",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
`,
      language: toLanguageEnum("korean"),
      category: "news",
    },
    {
      title: "안녕4",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
`,
      language: toLanguageEnum("korean"),
      category: "news",
    },
  ];
  const testingFile: Express.Multer.File = {
    fieldname: "file",
    originalname: "test-image.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    size: 1024,
    destination: "/tmp",
    filename: "12345-test-image.jpg",
    path: "/tmp/12345-test-image.jpg",
    buffer: Buffer.from("fake image content"),
    stream: new Readable(),
  };

  beforeAll(() => {
    const now = new Date();
    postsPagination = [
      {
        ...testingPosts[0],
        userId: 1,
        createdDate: now,
        updatedDate: now,
        id: 1,
        isOwner: jest.fn(),
      },
      {
        ...testingPosts[1],
        userId: 1,
        createdDate: now,
        updatedDate: now,
        id: 2,
        isOwner: jest.fn(),
      },
    ];
    news = [
      {
        postId: 1,
        content: testingPosts[0].content,
        title: testingPosts[0].title,
      },
      {
        postId: 2,
        content: testingPosts[1].content,
        title: testingPosts[1].title,
      },
      {
        postId: 3,
        content: testingPosts[2].content,
        title: testingPosts[2].title,
      },
    ];
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: {
            getOneById: jest.fn(),
            getAttachmentsByPostId: jest.fn(),
            getOneForCategory: jest.fn(),
            create: jest.fn(),
            getAllForCategory: jest.fn(),
            update: jest.fn(),
            findImagesWithPostId: jest.fn(),
            delete: jest.fn(),
            getNews: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: MediaService,
          useValue: {
            uploadImage: jest.fn(),
            uploadAttachment: jest.fn(),
            findImage: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get(PostRepository);
    media = module.get<MediaService>(MediaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("should create a post", () => {
    it("create post", async () => {
      const mockUploadImageResult = [
        {
          size: 5000,
          filename:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
        },
      ];
      const mockUploadAttachmentResult = [
        {
          originalname: testingFile.filename,
          mimeType: testingFile.mimetype,
          size: 1000,
          url: "/attachment/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
        },
      ];
      jest.spyOn(media, "findImage").mockResolvedValue(mockUploadImageResult);
      jest
        .spyOn(media, "uploadAttachment")
        .mockResolvedValue(mockUploadAttachmentResult[0]);
      await service.create(testingPosts[0], 1, [testingFile]);
      expect(media.findImage).toHaveBeenCalledWith([
        "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
      ]);
      expect(repository.create).toHaveBeenCalledWith(
        { ...testingPosts[0], userId: 1 },
        mockUploadImageResult,
        mockUploadAttachmentResult,
      );
      expect(media.uploadAttachment).toHaveBeenCalledWith(
        testingFile,
        "attachment",
      );
    });
  });

  describe("should get pagination", () => {
    it("get pagination", async () => {
      jest
        .spyOn(repository, "getAllForCategory")
        .mockResolvedValue([postsPagination, 5]);
      const result = await service.findAll(
        "news",
        1,
        2,
        toLanguageEnum("korean"),
      );
      expect(result).toMatchObject({
        data: postsPagination,
        currentPage: 1,
        prevPage: null,
        nextPage: 2,
        totalPage: 3,
      });
    });
  });

  describe("should get one post by id or category", () => {
    it("get one by id", async () => {
      const getAttachmentsByPostIdResult = [
        {
          postId: 1,
          originalName: "hello.png",
          url: "http://localhost:3000/api/files/post/hello.png",
          id: 1,
        },
      ];
      jest
        .spyOn(repository, "getOneById")
        .mockResolvedValue(postsPagination[0]);
      jest
        .spyOn(repository, "getAttachmentsByPostId")
        .mockResolvedValue(getAttachmentsByPostIdResult);

      const result = await service.findOneForId(1);
      expect(result).toMatchObject({
        post: postsPagination[0],
        files: getAttachmentsByPostIdResult,
      });
    });
    it("get one by category", async () => {
      jest
        .spyOn(repository, "getOneForCategory")
        .mockResolvedValue(postsPagination[0]);
      const result = await service.findOneForCategory(
        "news",
        toLanguageEnum("english"),
      );
      expect(result).toMatchObject(postsPagination[0]);
      expect(repository.getOneForCategory).toHaveBeenCalledWith(
        "news",
        "english",
      );
    });
  });

  describe("should get applicant", () => {
    it("get applicants", async () => {
      jest
        .spyOn(repository, "getOneForCategory")
        .mockResolvedValue(postsPagination[0]);

      jest.spyOn(repository, "getAttachmentsByPostId").mockResolvedValue([
        {
          postId: 1,
          originalName: "hello.png",
          url: "hello.png",
          id: 1,
        },
      ]);
      const result = await service.findApplicant();

      expect(result).toMatchObject({
        applicants: {
          imageUrl:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
          fileUrl: "hello.png",
        },
        entry: {
          imageUrl:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
          fileUrl: "hello.png",
        },
      });

      expect(repository.getOneForCategory).toHaveBeenCalledWith(
        "applicants",
        toLanguageEnum("korean"),
      );
      expect(repository.getOneForCategory).toHaveBeenCalledTimes(2);
      expect(repository.getAttachmentsByPostId).toHaveBeenCalledWith(1);
      expect(repository.getAttachmentsByPostId).toHaveBeenCalledTimes(2);
    });
  });

  describe("should get news", () => {
    it("findNews", async () => {
      jest.spyOn(repository, "getNews").mockResolvedValue(news);
      const result = await service.findNews(toLanguageEnum("korean"));
      expect(repository.getNews).toHaveBeenCalledWith(toLanguageEnum("korean"));
      expect(result).toMatchObject(
        news.map((item) => ({
          postId: item.postId,
          title: item.title,
          imageUrl:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
        })),
      );
    });
  });

  describe("should update post", () => {
    it("update", async () => {
      // 기존 이미지 찾기
      jest.spyOn(repository, "findImagesWithPostId").mockResolvedValue([
        {
          postId: 1,
          filename:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
          fileSize: 1000,
          id: 1,
        },
        {
          postId: 1,
          filename: "/post/nokori.png",
          fileSize: 1000,
          id: 2,
        },
      ]);
      // 새로 postImage 객체를 생성하기 위한 이미지 정보 찾기
      jest
        .spyOn(media, "findImage")
        .mockResolvedValue([{ size: 1000, filename: "/post/update.png" }]);

      // 새로운 첨부파일 업데이트
      jest.spyOn(media, "uploadAttachment").mockResolvedValue({
        originalname: testingFile.originalname,
        mimeType: testingFile.mimetype,
        size: testingFile.size,
        url: `/attachment/${testingFile.originalname}`,
      });
      const updateDto: UpdatePostDto = {
        title: "hello",
        content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<p><img src="http://localhost:3000/files/post/nokori.png" alt="" width="190" height="162"></p>
<p><img src="http://localhost:3000/files/post/update.png" alt="" width="190" height="162"></p>
`,
        deleteFilePath: '["/attachment/hello.pdf"]',
      };
      await service.update(1, updateDto, [testingFile]);

      const { deleteFilePath, ...expectedDto } = updateDto;
      expect(repository.update).toHaveBeenCalledWith(
        1,
        expectedDto,
        JSON.parse(deleteFilePath),
        [{ size: 1000, filename: "/post/update.png" }],
        [
          {
            originalname: testingFile.originalname,
            mimeType: testingFile.mimetype,
            size: testingFile.size,
            url: `/attachment/${testingFile.originalname}`,
          },
        ],
        ["/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png"],
      );
      expect(media.uploadAttachment).toHaveBeenCalledWith(
        testingFile,
        "attachment",
      );
      expect(media.findImage).toHaveBeenCalledWith(["/post/update.png"]);
      expect(repository.findImagesWithPostId).toHaveBeenCalledWith(1);
    });
  });

  describe("should delete post", () => {
    it("remove", async () => {
      jest.spyOn(repository, "delete").mockResolvedValue(true);
      const result = await service.remove(1);
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe("should search post", () => {
    it("search", async () => {
      jest.spyOn(repository, "search").mockResolvedValue([postsPagination, 5]);
      const result = await service.search(
        toSearchTargetEnum("author"),
        "hello",
        toLanguageEnum("english"),
        "news",
        2,
        2,
      );
      expect(result).toMatchObject({
        data: postsPagination,
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 3,
      });
      expect(repository.search).toHaveBeenCalledWith(
        "author",
        "hello",
        "english",
        "news",
        2,
        2,
      );
    });
  });
});
