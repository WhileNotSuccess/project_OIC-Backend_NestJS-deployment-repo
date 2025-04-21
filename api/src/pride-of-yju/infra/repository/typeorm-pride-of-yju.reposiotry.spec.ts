import { DataSource } from "typeorm";
import { TypeormPrideOfYjuRepository } from "./typeorm-pride-of-yju.repository";
import { PrideOfYjuOrmEntity } from "../entities/pride-of-yju.entity";

describe("PrideOfYjuRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormPrideOfYjuRepository;
  let createdId: number;
  const dto = {
    image: "/pride/123456.jpg",
    korean: "한글",
    english: "영어",
    japanese: "일본어",
  };
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
      entities: [PrideOfYjuOrmEntity],
    });
    await dataSource.initialize();
    repository = new TypeormPrideOfYjuRepository(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should create and return a PrideOfYju", async () => {
    // dto 저장
    const result = await repository.create(dto);

    expect(result.image).toBe(dto.image);
  });
  it("should get all PrideOfYju", async () => {
    // getAll 실행
    const result = await repository.getAll();
    // 비교
    expect(result[0].korean).toBe(dto.korean);
    expect(result[0].image).toBe(dto.image);
    expect(result[0].japanese).toBe(dto.japanese);
    // 생성된 id 저장
    createdId = result[0].id!;
  });
  it("should get one PrideOfYju", async () => {
    // getOne 실행
    const result = await repository.getOne(createdId);
    // 비교
    expect(result?.english).toBe(dto.english);
    expect(result?.id).toBe(createdId);
  });
  it("should update one carousel", async () => {
    // update 실행
    await repository.update(createdId, { korean: "수정된 한글" });
    // getOne 실행 후 수정된 열 비교
    const result = await repository.getOne(createdId);
    expect(result?.korean).toBe("수정된 한글");
  });
  it("should delete one carousel", async () => {
    // delete 실행
    const result = await repository.delete(createdId);
    expect(result).toBe(true);
    // getOne 실행후 해당 id 없으므로 null 확인
    const resTest = await repository.getOne(createdId);
    expect(resTest).toBeNull();
  });
});
