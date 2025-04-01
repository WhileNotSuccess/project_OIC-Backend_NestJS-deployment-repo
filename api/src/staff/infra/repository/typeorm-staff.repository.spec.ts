import { DataSource } from "typeorm";
import { TypeormStaffRepository } from "./typeorm-staff.repository";
import { StaffOrmEntity } from "../entities/staff.entity";
import { Staff } from "../../domain/entities/staff.entity";

describe("TypeormStaffRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormStaffRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [StaffOrmEntity],
    });
    await dataSource.initialize();
    repository = new TypeormStaffRepository(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should create and return a staff", async () => {
    const input = new Staff("홍길동", "01012345678", "admin");
    const created = await repository.create(input);

    expect(created.id).toBeDefined();
    expect(created.name).toBe("홍길동");
  });

  it("should get all staff", async () => {
    const list = await repository.getAll();
    expect(list.length).toBeGreaterThan(0);
  });

  it("should get one staff by id", async () => {
    const all = await repository.getAll();
    const one = await repository.getOne(all[0].id!);
    expect(one).toBeDefined();
    expect(one?.name).toBe(all[0].name);
  });

  it("should update a staff partially", async () => {
    const [first] = await repository.getAll();
    await repository.update(first.id!, { role: "staff" });
    const updated = await repository.getOne(first.id!);
    expect(updated?.role).toBe("staff");
  });

  it("should delete a staff", async () => {
    const [first] = await repository.getAll();
    const result = await repository.delete(first.id!);
    expect(result).toBe(true);
    const deleted = await repository.getOne(first.id!);
    expect(deleted).toBeNull();
  });
});
