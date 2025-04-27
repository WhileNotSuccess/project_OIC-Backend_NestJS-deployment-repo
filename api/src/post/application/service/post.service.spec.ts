import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { Post } from "src/post/domain/entities/post.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { Readable } from "stream";
import { News } from "src/post/domain/types/news";
import { UpdatePostDto } from "../dto/update-post.dto";
import { toSearchTargetEnum } from "src/common/utils/to-search-target-enum";
import { MediaServicePort } from "src/media/application/media-service.port";
import { HtmlParserPort } from "../port/html-parser.port";

describe("PostService", () => {
  let service: PostService;
  let repository: jest.Mocked<PostRepository>;
  let media: MediaServicePort;
  let parser: HtmlParserPort;
  // 페이지네이션 결과에서 나올 배열
  let postsPagination: Post[];

  // 뉴스 결과에서 나올 배열
  let news: News[];

  // 테스트 포스트
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

  // 테스트 용 파일
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
    // 페이지네이션 결과 생성
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
    // 뉴스 결과 생성
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
    // 모킹
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: HtmlParserPort,
          useValue: {
            extractFirstParagraphText: jest.fn(),
          },
        },
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
          provide: MediaServicePort,
          useValue: {
            uploadImage: jest.fn(),
            uploadAttachment: jest.fn(),
            findImage: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
    parser = module.get(HtmlParserPort);
    service = module.get<PostService>(PostService);
    repository = module.get(PostRepository);
    media = module.get<MediaServicePort>(MediaServicePort);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("should create a post", () => {
    it("create post", async () => {
      // MediaServicePort findImage 결과 생성
      const mockUploadImageResult = [
        {
          size: 5000,
          filename:
            "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
        },
      ];

      // MediaServicePort uploadAttachment 결과 생성
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

      // content 내부에서 src를 잘 잘라서 findImage를 호출하는 지 확인
      expect(media.findImage).toHaveBeenCalledWith([
        "/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png",
      ]);

      // Post에 userId도 추가했는지, 찾은 이미지랑 첨부파일도 repository로 보내는 지 확인
      expect(repository.create).toHaveBeenCalledWith(
        { ...testingPosts[0], userId: 1 },
        mockUploadImageResult,
        mockUploadAttachmentResult,
      );

      // 첨부파일을 서버에 저장했는지 확인
      expect(media.uploadAttachment).toHaveBeenCalledWith(
        testingFile,
        "attachment",
      );
    });
  });

  describe("should get pagination", () => {
    it("get pagination", async () => {
      // 페이지네이션 결과 모킹
      jest
        .spyOn(repository, "getAllForCategory")
        .mockResolvedValue([postsPagination, 5]);

      // news 카테고리 페이지네이션 호출
      const result = await service.findAll(
        "news",
        1,
        2,
        toLanguageEnum("korean"),
      );

      // 결과 확인인
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
      // postId로 첨부파일을 찾을 때 나오는 결과 모킹
      const getAttachmentsByPostIdResult = [
        {
          postId: 1,
          originalName: "hello.png",
          url: "http://localhost:3000/api/files/post/hello.png",
          id: 1,
        },
      ];
      jest
        .spyOn(repository, "getAttachmentsByPostId")
        .mockResolvedValue(getAttachmentsByPostIdResult);

      // post 결과 모킹
      jest
        .spyOn(repository, "getOneById")
        .mockResolvedValue(postsPagination[0]);

      // 서비스 호출
      const result = await service.findOneForId(1);

      // 결과 확인
      expect(result).toMatchObject({
        post: postsPagination[0],
        files: getAttachmentsByPostIdResult,
      });
    });
    it("get one by category", async () => {
      // post 결과 모킹
      jest
        .spyOn(repository, "getOneForCategory")
        .mockResolvedValue(postsPagination[0]);

      // 서비스 호출
      const result = await service.findOneForCategory(
        "news",
        toLanguageEnum("english"),
      );

      // 결과 확인
      expect(result).toMatchObject(postsPagination[0]);

      // getOneForCategory 메소드가 제대로 호출 됐는지 확인
      expect(repository.getOneForCategory).toHaveBeenCalledWith(
        "news",
        "english",
      );
    });
  });

  describe("should get applicant", () => {
    it("get applicants", async () => {
      // post 결과 모킹
      jest
        .spyOn(repository, "getOneForCategory")
        .mockResolvedValue(postsPagination[0]);

      // attachment 결과 모킹
      jest.spyOn(repository, "getAttachmentsByPostId").mockResolvedValue([
        {
          postId: 1,
          originalName: "hello.png",
          url: "hello.png",
          id: 1,
        },
      ]);
      const result = await service.findApplicant();

      // 결과 확인
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

      // getOneForCategory 파라미터 확인
      expect(repository.getOneForCategory).toHaveBeenCalledWith(
        "applicants",
        toLanguageEnum("korean"),
      );
      // getOneForCategory 호출 횟수 확인
      expect(repository.getOneForCategory).toHaveBeenCalledTimes(2);
      // getAttachmentsByPostId 파라미터 확인
      expect(repository.getAttachmentsByPostId).toHaveBeenCalledWith(1);

      // getAttachmentsByPostId 호출 횟수 확인
      expect(repository.getAttachmentsByPostId).toHaveBeenCalledTimes(2);
    });
  });

  describe("should get news", () => {
    it("findNews", async () => {
      // news 결과 모킹
      jest.spyOn(repository, "getNews").mockResolvedValue(news);
      const result = await service.findNews(toLanguageEnum("korean"));
      // 파리미터 확인
      expect(repository.getNews).toHaveBeenCalledWith(toLanguageEnum("korean"));
      // 결과 확인
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

  describe("should get notice", () => {
    it("findNotice", async () => {
      const now = new Date();
      const notices: Post[] = [
        new Post(
          "안녕",
          `<p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    <p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
    `,
          1,
          "notice",
          toLanguageEnum("korean"),
          now,
          now,
        ),
        new Post(
          "안녕1",
          `<p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    <p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
    `,
          1,
          "notice",
          toLanguageEnum("korean"),
          now,
          now,
        ),
        new Post(
          "안녕2",
          `<p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    <p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
    `,
          1,
          "notice",
          toLanguageEnum("korean"),
          now,
          now,
        ),
        new Post(
          "안녕3",
          `<p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    <p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
    `,
          1,
          "notice",
          toLanguageEnum("korean"),
          now,
          now,
        ),
        new Post(
          "안녕4",
          `<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
          <p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    `,
          1,
          "notice",
          toLanguageEnum("korean"),
          now,
          now,
        ),
      ];

      // news 결과 모킹
      jest
        .spyOn(repository, "getAllForCategory")
        .mockResolvedValue([notices, 5]);
      jest
        .spyOn(parser, "extractFirstParagraphText")
        .mockReturnValue("감사해요");
      const result = await service.findNotice(toLanguageEnum("korean"));

      // 파리미터 확인
      expect(repository.getAllForCategory).toHaveBeenCalledWith(
        "notice",
        1,
        10,
        toLanguageEnum("korean"),
      );
      // 결과 확인
      expect(result).toMatchObject(
        notices.map((item) => ({
          postId: item.id,
          title: item.title,
          content: "감사해요",
        })),
      );

      expect(typeof result[0].date).toBe("object");
      expect(parser.extractFirstParagraphText).toHaveBeenCalledTimes(
        notices.length,
      );
      expect(parser.extractFirstParagraphText).toHaveBeenNthCalledWith(
        5,
        `<p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
          <p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    `,
      );
      expect(parser.extractFirstParagraphText).toHaveBeenNthCalledWith(
        1,
        `<p>감사해요</p>
    <p>잘있어요</p>
    <p>다시만나요</p>
    <p><img src="http://localhost:3000/files/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png" alt="" width="190" height="162"></p>
    `,
      );
    });
  });

  describe("should update post", () => {
    it("update", async () => {
      // 기존 이미지 찾기 결과 모킹
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
      // 새로 postImage 객체를 생성하기 위한 이미지 정보 찾기 결과 모킹
      jest
        .spyOn(media, "findImage")
        .mockResolvedValue([{ size: 1000, filename: "/post/update.png" }]);

      // 새로운 첨부파일 업데이트 결과 모킹
      jest.spyOn(media, "uploadAttachment").mockResolvedValue({
        originalname: testingFile.originalname,
        mimeType: testingFile.mimetype,
        size: testingFile.size,
        url: `/attachment/${testingFile.originalname}`,
      });

      // updateDto 설정
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

      // update 파라미터 확인
      expect(repository.update).toHaveBeenCalledWith(
        1, // id
        expectedDto, // deleteFilePath 분리 됐는지 확인
        JSON.parse(deleteFilePath), // deleteFilePath가 배열로 잘 들어갔는지 확인
        [{ size: 1000, filename: "/post/update.png" }], // postImage 추가
        [
          {
            originalname: testingFile.originalname,
            mimeType: testingFile.mimetype,
            size: testingFile.size,
            url: `/attachment/${testingFile.originalname}`,
          },
        ], // attachment 추가
        ["/post/20250411-102416_aefe0ae0-1673-11f0-be4a-8b8c33409480.png"], // 삭제할 이미지 확인
      );

      // 파일 업로드 확인
      expect(media.uploadAttachment).toHaveBeenCalledWith(
        testingFile,
        "attachment",
      );

      // 이미지 생성 확인
      expect(media.findImage).toHaveBeenCalledWith(["/post/update.png"]);

      // 기존 이미지 탐색 확인
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
      // 검색 결과 모킹
      jest.spyOn(repository, "search").mockResolvedValue([postsPagination, 5]);

      // 서비스 호출
      const result = await service.search(
        toSearchTargetEnum("author"),
        "hello",
        toLanguageEnum("english"),
        "news",
        2,
        2,
      );
      // 결과 확인
      expect(result).toMatchObject({
        data: postsPagination,
        currentPage: 2,
        prevPage: 1,
        nextPage: 3,
        totalPage: 3,
      });

      // 파라미터 확인
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
