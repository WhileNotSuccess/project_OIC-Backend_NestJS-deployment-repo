import { Test, TestingModule } from "@nestjs/testing";
import { StaffController } from "./staff.controller";
import { StaffService } from "../application/service/staff.service";
import { CreateStaffDto } from "../application/dto/create-staff.dto";
import { UpdateStaffDto } from "../application/dto/update-staff.dto";
import { Staff } from "src/staff/domain/entities/staff.entity";
import { RequestWithCookies } from "src/common/request-with-cookies";

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
            findAllWithoutLanguage: jest.fn(),
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
        name: "name",
        position: "position",
        phone: "phone",
        email: "email",
        team: "team",
        position_jp: "position_jp",
        team_jp: "team_jp",
        position_en: "position_en",
        team_en: "team_en",
      };
      const created = new Staff(
        "name",
        "position",
        "phone",
        "email",
        "team",
        "position_jp",
        "team_jp",
        "position_en",
        "team_en",
      );
      service.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toMatchObject({
        message: "생성이 완료되었습니다.",
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("findAll", () => {
    it("should return all staff", async () => {
      const staffList = {
        test: [
          new Staff(
            "name",
            "position",
            "phone",
            "email",
            "team",
            "position_jp",
            "team_jp",
            "position_en",
            "team_en",
          ),
        ],
      };

      service.findAll.mockResolvedValue(staffList);
      const mockRequest = {
        cookies: { language: "korean" },
      } as unknown as RequestWithCookies;
      const result = await controller.findAll(mockRequest);
      expect(service.findAll).toHaveBeenCalledWith("korean");
      expect(result).toEqual({
        message: "직원 목록을 불러왔습니다",
        data: staffList,
      });
    });
  });

  describe("findAllForAdmin", () => {
    it("should return all staff", async () => {
      const staffList = {
        test: [
          new Staff(
            "name",
            "position",
            "phone",
            "email",
            "team",
            "position_jp",
            "team_jp",
            "position_en",
            "team_en",
          ),
        ],
      };

      service.findAllWithoutLanguage.mockResolvedValue(staffList);

      const result = await controller.findAllForAdmin();
      expect(result).toEqual({
        message: "직원 목록을 불러왔습니다",
        data: staffList,
      });
    });
  });

  describe("update", () => {
    it("should update staff and return result", async () => {
      const dto: UpdateStaffDto = {
        name: "hi",
      };
      const updated = new Staff(
        "hi",
        "position",
        "phone",
        "email",
        "team",
        "position_jp",
        "team_jp",
        "position_en",
        "team_en",
      );
      service.update.mockResolvedValue(updated);

      const result = await controller.update("1", dto);
      expect(result).toMatchObject({ message: "수정이 완료되었습니다." });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe("remove", () => {
    it("should remove staff and return result", async () => {
      service.remove.mockResolvedValue(true);
      const result = await controller.remove("1");
      expect(result).toMatchObject({ message: "삭제가 완료되었습니다." });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
