import { TypeormUserRepository } from "./typeorm-user.repository";
import { DataSource, QueryRunner } from "typeorm";
import { UserOrmEntity } from "../entities/user.entity";
import { User } from "src/users/domain/entities/user.entity";
import { AuthOrmEntity } from "src/auth/infra/entities/auth.entity";
import { PostOrmEntity } from "src/post/infra/entities/post-orm.entity";
import { AttachmentOrmEntity } from "src/post/infra/entities/attachment-orm.entity";
import { PostImageOrmEntity } from "src/post/infra/entities/post-image-orm.entity";

describe("TypeormUserRepository", () => {
  let repository: TypeormUserRepository;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  const userDto: User = {
    name: "아무개",
    createDate: new Date(),
    email: "test@gmail.com",
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
      entities: [
        UserOrmEntity,
        AuthOrmEntity,
        PostOrmEntity,
        PostImageOrmEntity,
        AttachmentOrmEntity,
      ],
    });
    await dataSource.initialize();
    repository = new TypeormUserRepository(dataSource);
  });
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

  it("should save a user and return it", async () => {
    const result = await repository.save(queryRunner, userDto);

    expect(result).toEqual({ ...userDto, id: 1 });
  });

  it("should return a user by email", async () => {
    const result = await repository.findByEmail("test@gmail.com");
    expect(result).toEqual({ ...userDto, id: 1 });
  });

  it("should return a user by id", async () => {
    const result = await repository.findById(1);

    expect(result).toEqual({ ...userDto, id: 1 });
  });

  it("should return a list of users with pagination", async () => {
    const options = {
      limit: 10,
      page: 1,
      sortBy: "name" as const,
      order: "ASC" as const,
    };

    const result = await repository.findAll(options);

    expect(result.users.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it("should update name and return updatedUser", async () => {
    const result = await repository.updateName(queryRunner, 1, "누렁이");

    expect(result.name).toBe("누렁이");
  });
});
