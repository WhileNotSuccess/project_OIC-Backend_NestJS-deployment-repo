import { Test, TestingModule } from "@nestjs/testing";
import { StaffController } from "./staff.controller";
import { StaffService } from "../application/service/staff.service";
import { CreateStaffDto } from "../application/dto/create-staff.dto";
import { UpdateStaffDto } from "../application/dto/update-staff.dto";
import { Staff } from "../domain/entities/staff.entity";

describe("StaffController", () => {
  let controller: StaffController;
  let service: jest.Mocked<StaffService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get(StaffService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call service.create and return result", async () => {
      const dto: CreateStaffDto = {
        name: "홍길동",
        phoneNumber: "01012345678",
        role: "admin",
      };
      const created = new Staff(dto.name, dto.phoneNumber, dto.role, 1);
      service.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("findAll", () => {
    it("should return all staff", async () => {
      const staffList = [
        new Staff("A", "01011112222", "admin", 1),
        new Staff("B", "01022223333", "staff", 2),
      ];
      service.findAll.mockResolvedValue(staffList);

      const result = await controller.findAll();
      expect(result).toEqual(staffList);
    });
  });

  describe("findOne", () => {
    it("should return one staff by id", async () => {
      const staff = new Staff("A", "01011112222", "admin", 1);
      service.findOne.mockResolvedValue(staff);

      const result = await controller.findOne("1");
      expect(result).toEqual(staff);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe("update", () => {
    it("should update staff and return result", async () => {
      const dto: UpdateStaffDto = {
        name: "Updated Name",
        phoneNumber: "01099998888",
        role: "staff",
      };
      const updated = new Staff(dto.name!, dto.phoneNumber!, dto.role!, 1);
      service.update.mockResolvedValue(updated);

      const result = await controller.update("1", dto);
      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe("remove", () => {
    it("should remove staff and return result", async () => {
      service.remove.mockResolvedValue(true);
      const result = await controller.remove("1");
      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
