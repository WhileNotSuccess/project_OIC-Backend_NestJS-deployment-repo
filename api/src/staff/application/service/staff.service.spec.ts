import { Test, TestingModule } from "@nestjs/testing";
import { StaffService } from "./staff.service";
import { StaffRepository } from "src/staff/domain/repository/staff.repository";
import { Staff } from "src/staff/domain/entities/staff.entity";
import { toLanguageEnum } from "src/common/utils/to-language-enum";

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
      const dto = {
        name: "홍길동",
        position: "대장",
        phone: "01012345678",
        email: "hello@hello.com",
        team: "팀1",
        position_jp: "頭",
        team_jp: "チーム1",
        position_en: "head",
        team_en: "team1",
        role: "총괄",
        role_en: "all",
        role_jp: "全部",
      };
      const created = new Staff(
        "홍길동",
        "대장",
        "01012345678",
        "hello@hello.com",
        "팀1",
        "頭",
        "チーム1",
        "head",
        "team1",
        1,
        "총괄",
        "all",
        "全部",
        1,
      );
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
        new Staff(
          "a",
          "position",
          "phone",
          "email",
          "team1",
          "position_jp",
          "team_jp",
          "position_en",
          "team_en1",
          1,
          "role",
          "role_en",
          "role_jp",
          1,
        ),
        new Staff(
          "b",
          "position",
          "phone",
          "email",
          "team2",
          "position_jp",
          "team_jp",
          "position_en",
          "team_en1",
          1,
          "role",
          "role_en",
          "role_jp",
          2,
        ),
        new Staff(
          "c",
          "position",
          "phone",
          "email",
          "team1",
          "position_jp",
          "team_jp",
          "position_en",
          "team_en2",
          1,
          "role",
          "role_en",
          "role_jp",
          3,
        ),
        new Staff(
          "d",
          "position",
          "phone",
          "email",
          "team2",
          "position_jp",
          "team_jp",
          "position_en",
          "team_en2",
          1,
          "role",
          "role_en",
          "role_jp",
          4,
        ),
      ];
      repository.getAll.mockResolvedValue(list);

      const result = await service.findAll(toLanguageEnum("english"));
      expect(result).toMatchObject({
        team_en1: [
          {
            name: "a",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team_en1",
            role: "role_en",
            id: 1,
          },
          {
            name: "b",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team_en1",
            role: "role_en",
            id: 2,
          },
        ],
        team_en2: [
          {
            name: "c",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team_en2",
            role: "role_en",
            id: 3,
          },
          {
            name: "d",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team_en2",
            role: "role_en",
            id: 4,
          },
        ],
      });
    });
  });

  describe("update", () => {
    it("should update staff info", async () => {
      const updated = new Staff(
        "updated",
        "대장",
        "01000000000",
        "hello@hello.com",
        "팀1",
        "頭",
        "チーム1",
        "head",
        "team1",
        1,
        "admin",
        "all",
        "全部",
        1,
      );
      repository.update.mockResolvedValue(updated);

      const result = await service.update(1, {
        name: "updated",
        phone: "01000000000",
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
