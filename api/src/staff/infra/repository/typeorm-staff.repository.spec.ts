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
    const input = new Staff(
      "a",
      "position",
      "phone",
      "email",
      "team1",
      "position_jp",
      "team_jp",
      "position_en",
      "team_en",
      "role",
      "role_en",
      "role_jp",
    );
    const created = await repository.create(input);
    expect(created).toMatchObject({
      name: "a",
      position: "position",
      phone: "phone",
      email: "email",
      team: "team1",
      position_jp: "position_jp",
      team_jp: "team_jp",
      position_en: "position_en",
      team_en: "team_en",
      role: "role",
      role_en: "role_en",
      role_jp: "role_jp",
      id: 1,
    });
  });

  it("should get all staff", async () => {
    const list = await repository.getAll();
    expect(list.length).toBeGreaterThan(0);
  });

  it("should update a staff partially", async () => {
    await repository.update(1, { role: "staff" });
    const updated = await repository.getAll();
    expect(updated[0].role).toBe("staff");
  });

  it("should delete a staff", async () => {
    const result = await repository.delete(1);
    expect(result).toBe(true);
    const deleted = await repository.getAll();
    expect(deleted.length).toBe(0);
  });
});
