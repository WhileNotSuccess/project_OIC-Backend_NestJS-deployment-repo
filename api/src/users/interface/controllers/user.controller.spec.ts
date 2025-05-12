import { Test, TestingModule } from "@nestjs/testing";
import { GetAllUsersUseCase } from "src/users/application/use-cases/get-all-users.use-case";
import { GetUserInfo } from "src/users/application/use-cases/get-user-info.use-case";
import { ChangeUserName } from "src/users/application/use-cases/change-user-name-use-case";
import { AdminGuard } from "src/shared/guards/admin.guard";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { CustomRequest, UsersController } from "./user.controller";
import { FindAllUsersOptions } from "src/users/domain/repositories/user.repository";

describe("UsersController", () => {
  let controller: UsersController;
  let changeUserName: ChangeUserName;

  const mockUser = {
    id: 1,
    name: "Tester",
    email: "test@gmail.com",
    admin: false,
  };

  const mockUpdatedUser = {
    id: 1,
    name: "아무개",
    email: "test@gmail.com",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: GetAllUsersUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({ users: [], pageData: {} }), // 여기서 mock 해두면 밑에서 매번 지정할 필요가 없음
          },
        },
        {
          provide: GetUserInfo,
          useValue: { execute: jest.fn().mockResolvedValue(mockUser) },
        },
        {
          provide: ChangeUserName,
          useValue: { execute: jest.fn().mockResolvedValue(mockUpdatedUser) },
        },
      ],
    })
      // 모든 가드를 통과 하게 만들기 => token 설정 안해도 됨
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    changeUserName = module.get(ChangeUserName);
  });

  describe("PATCH /", () => {
    it("should successfully change the user name", async () => {
      const mockRequest = {
        user: mockUser,
      } as CustomRequest;

      const name = "아무개";
      const result = await controller.nameChange(mockRequest, name);

      expect(result.message).toBe("이름이 수정되었습니다.");
      expect(result.userInfo.name).toBe("아무개");
    });

    it("should throw an error if the name change fails", async () => {
      // 위에서 만들어둔 mock 함수랑 다른 응답(에러)을 받기 위해 선언
      jest
        .spyOn(changeUserName, "execute")
        .mockRejectedValueOnce(new Error("잘못된 접근 입니다."));

      const mockRequest = {
        user: mockUser,
      } as CustomRequest;

      await expect(
        controller.nameChange(mockRequest, "누렁이"),
      ).rejects.toThrow(new Error("잘못된 접근 입니다."));
    });
  });

  describe("GET /admin", () => {
    it("should check if the user is an admin", () => {
      const mockRequest = {
        user: mockUser,
      } as CustomRequest;

      const result = controller.checkAdmin(mockRequest);
      expect(result.message).toBe("관리자 확인 결과 입니다.");
      expect(result.result).toBe(false);
    });
  });

  describe("GET /users/info", () => {
    it("should return all user info", async () => {
      const result = await controller.getAllUserInfo({} as FindAllUsersOptions);

      expect(result.message).toBe("유저 정보를 불러왔습니다.");
      expect(result.data).toEqual([]);
      expect(result.pageData).toEqual({});
    });
  });

  describe("GET /", () => {
    it("should return the user info", async () => {
      const mockRequest = {
        user: mockUser,
      } as CustomRequest;

      const result = await controller.findUserInfo(mockRequest);

      expect(result.message).toBe("유저 정보를 반환합니다.");
      expect(result.userInfo).toEqual(mockUser);
    });
  });
});
