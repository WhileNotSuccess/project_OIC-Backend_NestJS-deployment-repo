import { DataSource } from "typeorm";
import { TypeormCarouselRepository } from "./typeorm-carousel.repository";
import { CarouselOrmEntity } from "../entites/carousel.entity";

describe("TypeormCarouselRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormCarouselRepository;
  let createdId: number;
  const dto = {
    image: "/203846-92082392.jpg",
    postId: 1,
    koreanTitle: "한글",
    koreanDescription: "한글설명",
    englishTitle: "영어",
    englishDescription: "영어설명",
    japaneseTitle: "일본어",
    japaneseDescription: "일본어설명",
  };

  beforeAll(async () => {
    // 데이터베이스 생성
    // dataSource = new DataSource({
    //   type: "sqlite",
    //   database: ":memory:",
    //   synchronize: true,
    //   entities: [CarouselOrmEntity],
    // });
    dataSource = new DataSource({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      dropSchema: true, // 테스트 후 테이블 초기화
      entities: [CarouselOrmEntity],
    });
    await dataSource.initialize();
    repository = new TypeormCarouselRepository(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should create and return a carousel", async () => {
    // 받은 dto를 저장
    const result = await repository.create(dto);

    expect(result.image).toContain(dto.image);
  });
  it("should get all carousel", async () => {
    // 저장된 정보 호출
    const result = await repository.getAll();
    // 비교3개 실행
    expect(result[0].koreanTitle).toBe(dto.koreanTitle);
    expect(result[0].image).toContain(dto.image);
    expect(result[0].englishDescription).toBe(dto.englishDescription);
    // 생성된 id를 createdId에 등록
    createdId = result[0].id!;
  });
  it("should get one carousel", async () => {
    // carousel 하나 호출
    const result = await repository.getOne(createdId);
    // 비교
    expect(result?.koreanDescription).toBe(dto.koreanDescription);
    expect(result?.englishTitle).toBe(dto.englishTitle);
    expect(result?.postId).toBe(dto.postId);
    expect(result?.japaneseDescription).toBe(dto.japaneseDescription);
  });
  it("should update one carousel", async () => {
    // 수정 요청
    await repository.update(createdId, { koreanTitle: "수정된 한글" });
    // 수정 후 호출
    const result = await repository.getOne(createdId);
    // 수정 됐는지 확인
    expect(result?.koreanTitle).toBe("수정된 한글");
  });
  it("should delete one carousel", async () => {
    // 삭제 요청
    const result = await repository.delete(createdId);
    // true면 삭제 완료
    expect(result).toBe(true);
  });
});
