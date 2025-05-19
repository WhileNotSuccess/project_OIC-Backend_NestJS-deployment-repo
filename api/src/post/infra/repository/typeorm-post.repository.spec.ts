import { DataSource } from "typeorm";
import { TypeormPostRepository } from "./typeorm-post.repository";
import { PostOrmEntity } from "../entities/post-orm.entity";
import { Post } from "src/post/domain/entities/post.entity";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { imageMetadata } from "src/media/domain/image-metadata";
import { UploadAttachmentReturn } from "src/media/domain/upload-attachment";
import { AttachmentOrmEntity } from "../entities/attachment-orm.entity";
import { PostImageOrmEntity } from "../entities/post-image-orm.entity";
import { toSearchTargetEnum } from "src/common/utils/to-search-target-enum";
import { TypeormPostQueryRepository } from "./typeorm-post-query.repository";
import { UserOrmEntity } from "src/users/infra/entities/user.entity";
import { AuthOrmEntity } from "src/auth/infra/entities/auth.entity";

describe("TypeormPostRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormPostRepository;
  let postId1: Post;
  let latestNotice: Post;
  let latestNew: Post;
  let createdNotices: Post[];
  let createdNews: Post[];
  let queryRepository: TypeormPostQueryRepository;

  const createDtoNotice: Partial<Post>[] = [
    {
      title: "제목1",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "notice",
      userId: 1,
    },
    {
      title: "제목2",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "notice",
      userId: 1,
    },
    {
      title: "제목3",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "notice",
      userId: 1,
    },
    {
      title: "제목4",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "notice",
      userId: 1,
    },
  ];
  const createDtoNews: Partial<Post>[] = [
    {
      title: "제목1",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "news",
      userId: 1,
    },
    {
      title: "제목2",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "news",
      userId: 1,
    },
    {
      title: "제목3",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "news",
      userId: 1,
    },
    {
      title: "제목4",
      content: `<p>감사해요</p>
<p>잘있어요</p>
<p>다시만나요</p>
<img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
<img src="http://localhost:3000/files/post/filename5.png" alt="" width="190" height="162">
`,
      language: toLanguageEnum("korean"),
      category: "news",
      userId: 1,
    },
  ];
  const imageData: imageMetadata[] = [
    { size: 1000, filename: "/post/filename1.png" },
    { size: 1000, filename: "/post/filename2.png" },
    { size: 1000, filename: "/post/filename3.png" },
    { size: 1000, filename: "/post/filename4.png" },
    { size: 1000, filename: "/post/filename5.png" },
  ];
  const fileData: UploadAttachmentReturn[] = [
    {
      originalname: "hello1.pdf",
      mimeType: "application/octet-stream",
      size: 1000,
      url: "/attachment/hello1.pdf",
    },
    {
      originalname: "hello2.pdf",
      mimeType: "application/octet-stream",
      size: 1000,
      url: "/attachment/hello2.pdf",
    },
  ];
  beforeAll(async () => {
    dataSource = new DataSource({
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
    });
    await dataSource.initialize();
    repository = new TypeormPostRepository(dataSource);
    queryRepository = new TypeormPostQueryRepository(dataSource);
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(UserOrmEntity)
      .values([
        {
          id: 1,
          email: "user",
          name: "user",
        },
      ])
      .execute();

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(AuthOrmEntity)
      .values([
        {
          userId: 1,
          hashedPassword: "hashedPassword",
          googleId: "googleId",
        },
      ])
      .execute();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("create", async () => {
    // create 호출
    const resultNotice = await Promise.all(
      createDtoNotice.map(async (item) => {
        return await repository.create(item, imageData, fileData);
      }),
    );
    const resultNews = await Promise.all(
      createDtoNews.map(async (item) => {
        return await repository.create(item, imageData, fileData);
      }),
    );

    // id가 1인 post 저장
    if (resultNotice.filter((item) => item.id === 1)[0]) {
      postId1 = resultNotice.filter((item) => item.id === 1)[0];
    } else {
      postId1 = resultNews.filter((item) => item.id === 1)[0];
    }

    // 가장 최근의 notice와 news 저장
    latestNotice = resultNotice.filter(
      (item) => item.id === resultNotice.length,
    )[0];
    latestNew = resultNews.filter(
      (item) => item.id === resultNews.length + resultNotice.length,
    )[0];

    // 생성된 결과 저장
    createdNotices = resultNotice;
    createdNews = resultNews;

    expect(resultNews.length).toBe(createDtoNews.length);
    expect(resultNotice.length).toBe(createDtoNews.length);
  });

  it("getOneById", async () => {
    const result = await queryRepository.getOneWithAuthorById(1);

    expect(result).toMatchObject({ ...postId1, author: "user" });
  });

  it("getAttachmentsByPostId", async () => {
    const result = await repository.getAttachmentsByPostId(1);
    expect(result).toMatchObject([
      {
        postId: 1,
        originalName: fileData[0].originalname,
        url: fileData[0].url,
      },
      {
        postId: 1,
        originalName: fileData[1].originalname,
        url: fileData[1].url,
      },
    ]);
  });

  it("getOneForCategory", async () => {
    const notice = await repository.getOneForCategory("notice", "korean");
    const news = await repository.getOneForCategory("news", "korean");
    expect(notice).toMatchObject(latestNotice);
    expect(news).toMatchObject(latestNew);
  });

  it("getAllForCategory", async () => {
    const notices = await queryRepository.getManyWithAuthorByCategory(
      "notice",
      2,
      1,
      toLanguageEnum("korean"),
    );
    // 한 페이지당 1개의 게시글, 2번째 페이지이고, 정렬기준이 수정일자 내림차순 이므로, 두 번째로 id가 큰 글을 찾아야 함
    const expectedResult = createdNotices.filter(
      (item) => item.id === createdNotices.length - 1,
    );
    expect(notices).toMatchObject([expectedResult, createDtoNotice.length]);
  });

  it("update", async () => {
    // 업데이트 dto 생성
    const updateDto = {
      content: `<p>감사해요</p>
      <p>잘있어요</p>
      <p>다시만나요</p>
      <img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename6.png" alt="" width="190" height="162">`,
    };
    // 기존 파일중 삭제할 파일 (문자열 배열)
    const deleteFile = ["/attachment/hello1.pdf"];
    // 새로 추가할 이미지 (imageMetaData[])
    const newImage: imageMetadata[] = [
      { size: 1000, filename: "/post/filename6.png" },
    ];
    // 새로 추가할 파일 (uploadAttachmentReturn[])
    const newFile: UploadAttachmentReturn[] = [
      {
        originalname: "good1.pdf",
        mimeType: "application/octet-stream",
        size: 1000,
        url: "/attachment/good1.pdf",
      },
    ];
    // 삭제할 이미지 (문자열 배열)
    const deleteImage = ["/post/filename5.png"];

    await repository.update(
      1,
      updateDto,
      deleteFile,
      newImage,
      newFile,
      deleteImage,
    );

    //content 확인
    const resultContent = await queryRepository.getOneWithAuthorById(1);
    expect(resultContent?.content).toEqual(`<p>감사해요</p>
      <p>잘있어요</p>
      <p>다시만나요</p>
      <img src="http://localhost:3000/files/post/filename1.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename2.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename3.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename4.png" alt="" width="190" height="162">
      <img src="http://localhost:3000/files/post/filename6.png" alt="" width="190" height="162">`);

    //파일 삭제 및 추가 확인
    const resultAttachment = await repository.getAttachmentsByPostId(1);
    expect(resultAttachment).toMatchObject([
      {
        postId: 1,
        originalName: fileData[1].originalname,
        url: fileData[1].url,
      },
      {
        postId: 1,
        originalName: "good1.pdf",
        url: "/attachment/good1.pdf",
      },
    ]);

    //이미지 삭제 및 추가 확인
    const resultImage = await repository.findImagesWithPostId(1);
    expect(resultImage).toMatchObject([
      { postId: 1, fileSize: 1000, filename: "/post/filename1.png" },
      { postId: 1, fileSize: 1000, filename: "/post/filename2.png" },
      { postId: 1, fileSize: 1000, filename: "/post/filename3.png" },
      { postId: 1, fileSize: 1000, filename: "/post/filename4.png" },
      { postId: 1, fileSize: 1000, filename: "/post/filename6.png" },
    ]);
  });

  it("delete", async () => {
    const result = await repository.delete(1);
    expect(result).toBe(true);
    const post = await queryRepository.getOneWithAuthorById(1);
    const image = await repository.findImagesWithPostId(1);
    const attachment = await repository.getAttachmentsByPostId(1);
    expect(post).toBeFalsy();
    expect(image.length).toBeFalsy();
    expect(attachment.length).toBeFalsy();
  });

  it("getNews", async () => {
    const result = await repository.getNews("korean");
    expect(result).toMatchObject(
      createdNews
        .sort((a, b) => {
          if (a.id && b.id) {
            return b.id - a.id;
          } else {
            return 1;
          }
        })
        .map((item) => ({
          content: item.content,
          postId: item.id,
          title: item.title,
        })),
    );
  });

  it("search", async () => {
    const result = await queryRepository.search(
      toSearchTargetEnum("title"),
      "3",
      toLanguageEnum("korean"),
      "notice",
      1,
      10,
    );
    expect(result).toMatchObject([[createDtoNotice[2]], 1]);
  });
});
