import { Test, TestingModule } from "@nestjs/testing";
import { StaffService } from "./staff.service";
import { StaffRepository } from "src/staff/domain/repository/staff.repository";
import { Staff } from "src/staff/domain/entities/staff.entity";

describe("StaffService", () => {
  let service: StaffService;
  let repository: jest.Mocked<StaffRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: StaffRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            getOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repository = module.get(StaffRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a staff member", async () => {
      const dto = { name: "홍길동", phoneNumber: "01012345678", role: "admin" };
      const created = new Staff(dto.name, dto.phoneNumber, dto.role, 1);
      repository.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
    });
  });

  describe("findAll", () => {
    it("should return all staff", async () => {
      const list = [
        new Staff("a", "01011112222", "staff", 1),
        new Staff("b", "01033334444", "admin", 2),
      ];
      repository.getAll.mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toEqual(list);
    });
  });

  describe("findOne", () => {
    it("should return a staff by id", async () => {
      const staff = new Staff("a", "01011112222", "staff", 1);
      repository.getOne.mockResolvedValue(staff);

      const result = await service.findOne(1);
      expect(result).toEqual(staff);
    });
  });

  describe("update", () => {
    it("should update staff info", async () => {
      const updated = new Staff("updated", "01000000000", "admin", 1);
      repository.update.mockResolvedValue(updated);

      const result = await service.update(1, {
        name: "updated",
        phoneNumber: "01000000000",
        role: "admin",
      });
      expect(result).toEqual(updated);
    });
  });

  describe("remove", () => {
    it("should delete a staff and return true", async () => {
      repository.delete.mockResolvedValue(true);
      const result = await service.remove(1);
      expect(result).toBe(true);
    });
  });
});
