import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { LoginWithGoogleUseCase } from "src/auth/application/use-cases/login-with-google.use-case";
import { ConfigService } from "@nestjs/config";
import { LoginUseCase } from "src/auth/application/use-cases/login.use-case";
import { CreateUserUseCase } from "src/auth/application/use-cases/create-user.use-case";
import { Request, Response } from "express";
import { LoginInput } from "src/auth/application/dto/login-input.dto";
import { RegisterInput } from "src/auth/application/dto/register-input.dto";
import { LinkGoogleUseCase } from "src/auth/application/use-cases/link-google.use-case";
import { ChangePasswordUseCase } from "src/auth/application/use-cases/change-password.use-case";
import { changePWDto } from "src/auth/application/dto/change-password.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let loginGoogle: LoginWithGoogleUseCase;
  let loginJwt: LoginUseCase;
  let createUser: CreateUserUseCase;
  let frontUrl: string;
  let changePW: ChangePasswordUseCase;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === "FRONTEND_URL") return "https://localhost.com/api";
    }),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {
      cookie: jest.fn(),
      redirect: jest.fn(),
      end: jest.fn(),
    };
    return res as Response;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginWithGoogleUseCase, useValue: { execute: jest.fn() } },
        { provide: LoginUseCase, useValue: { execute: jest.fn() } },
        { provide: CreateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: LinkGoogleUseCase, useValue: { execute: jest.fn() } },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ChangePasswordUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();
    frontUrl = process.env.FRONT_URL ?? "https://localhost.com/api";

    controller = module.get<AuthController>(AuthController);
    loginGoogle = module.get<LoginWithGoogleUseCase>(LoginWithGoogleUseCase);
    loginJwt = module.get<LoginUseCase>(LoginUseCase);
    createUser = module.get<CreateUserUseCase>(CreateUserUseCase);
    changePW = module.get(ChangePasswordUseCase);
  });

  it("should be defined", () => {
    // 단일 동작, 이 경우에는 각 describe가 실행 되기 전 beforeEach가 실행되어 controller가 정의되었는지 확인
    expect(controller).toBeDefined();
  });

  describe("GET /google/login", () => {
    it('should return "googleLogin"', () => {
      expect(controller.googleLogin()).toBe("googleLogin");
    });
  });

  describe("GET /google/redirect", () => {
    it("should set cookie and redirect", async () => {
      const req = {
        user: { sub: "google-user-id" },
      } as unknown as Request;
      const res = mockResponse();

      jest.spyOn(loginGoogle, "execute").mockResolvedValue({
        userId: 1,
        accessToken: "token123",
      });

      await controller.googleRedirect(req, res);

      expect(loginGoogle.execute).toHaveBeenCalledWith({
        googleId: "google-user-id",
      });
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        "token123",
        expect.any(Object),
      );
      expect(res.redirect).toHaveBeenCalledWith(`${frontUrl}/admin`);
    });
  });

  describe("POST /login", () => {
    it("should login and set cookie", async () => {
      const body: LoginInput = {
        email: "test@example.com",
        password: "password",
      };
      const res = mockResponse();

      jest
        .spyOn(loginJwt, "execute")
        .mockResolvedValue({ userId: 1, accessToken: "jwt-token" });

      await controller.loginWithJwt(body, res);

      expect(loginJwt.execute).toHaveBeenCalledWith(body);
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        "jwt-token",
        expect.any(Object),
      );
      expect(res.redirect).toHaveBeenCalledWith(frontUrl);
    });
  });

  describe("POST /register", () => {
    it("should call createUser and return success message", async () => {
      const body: RegisterInput = {
        name: "tester",
        email: "tester@gmail.com",
        password: "123456",
      };

      jest.spyOn(createUser, "execute").mockResolvedValue({
        id: 1,
        name: body.name,
        email: body.email,
        createDate: new Date(),
      });

      const result = await controller.registerWithJWT(body);

      expect(createUser.execute).toHaveBeenCalledWith({
        name: body.name,
        email: body.email,
        plainPassword: body.password,
      });

      expect(result).toEqual({ message: "회원가입되었습니다." });
    });
  });
  describe("PATCH /ch-pw", () => {
    it("should call changePassword with correct parameters", async () => {
      const req = {
        user: { id: 1, email: "user@example.com" },
      } as unknown as Request;
      const body: changePWDto = {
        exPassword: "oldPass",
        newPassword: "newPass",
      };

      jest.spyOn(changePW, "execute").mockResolvedValue(true);

      const result = await controller.changePassword(req, body);

      expect(changePW.execute).toHaveBeenCalledWith(
        req.user,
        body.exPassword,
        body.newPassword,
      );
      expect(result.message).toBe("비밀번호가 변경되었습니다.");
    });
  });
});
