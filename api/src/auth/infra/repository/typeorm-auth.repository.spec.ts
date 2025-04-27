import { DataSource, QueryRunner } from "typeorm";
import { AuthOrmEntity } from "src/auth/infra/entities/auth.entity";
import { TypeormAuthRepository } from "./typeorm-auth.repository";
import { UserOrmEntity } from "src/users/infra/entities/user.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";

describe("TypeormUserRepository", () => {
  let repository: TypeormAuthRepository;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const authDto = {
    userId: 1,
    hashedPassword: "1234",
    googleId: "123456",
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
      entities: [UserOrmEntity, AuthOrmEntity],
    });
    await dataSource.initialize();
    // user - auth 관계를 위해 user 테이블에 미리 하나 넣어두고 시작
    await dataSource.getRepository(UserOrmEntity).save({
      name: "아무개",
      email: "test@gmail.com",
      createDate: new Date(),
    });

    repository = new TypeormAuthRepository(dataSource);
  });
  // use-case에서 transactional을 써서 queryRunner를 받아오기 때문에 transaction을 매 동작 전후로 설정
  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });
  afterEach(async () => {
    await queryRunner.commitTransaction();
    await queryRunner.release();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save a auth", async () => {
    const result = await repository.save(queryRunner, authDto as Auth);
    expect(result).toBe(true);
  });
  it("should find auth by googleId", async () => {
    const result = await repository.findByGoogleId(authDto.googleId);
    expect(result).toBeDefined();
  });
  it("should find auth by userId", async () => {
    const result = await repository.findByUserId(authDto.userId);
    expect(result).toBeDefined();
  });
});
