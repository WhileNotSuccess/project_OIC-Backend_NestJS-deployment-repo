import { Test, TestingModule } from "@nestjs/testing";
import { LoginUseCase } from "./login.use-case";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { PasswordService } from "src/auth/domain/services/password.service";
import { TokenService } from "../services/token.service";
import { BadRequestException } from "@nestjs/common";
import { LoginInput } from "../dto/login-input.dto";
import { User } from "src/users/domain/entities/user.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let authRepository: jest.Mocked<AuthRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let tokenService: jest.Mocked<TokenService>;

  const mockUser = { id: 1, email: "test@gmail.com", name: "Tester" } as User;
  const mockCredential = {
    userId: 1,
    hashedPassword: "hashed-password",
  } as Auth;

  const loginInput: LoginInput = {
    email: "test@gmail.com",
    password: "password123",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: UserRepository, useValue: { findByEmail: jest.fn() } },
        { provide: AuthRepository, useValue: { findByUserId: jest.fn() } },
        { provide: PasswordService, useValue: { compare: jest.fn() } },
        { provide: TokenService, useValue: { generateAccessToken: jest.fn() } },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get(UserRepository);
    authRepository = module.get(AuthRepository);
    passwordService = module.get(PasswordService);
    tokenService = module.get(TokenService);
  });

  it("should throw BadRequestException if email does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(loginInput)).rejects.toThrow(
      new BadRequestException("이메일이 존재하지 않습니다."),
    );
  });

  it("should throw BadRequestException if authentication information is missing", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    authRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(loginInput)).rejects.toThrow(
      new BadRequestException("인증 정보가 없습니다."),
    );
  });

  it("should throw BadRequestException if the account is a Google login account", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    // 구글 로그인 계정으로 설정
    authRepository.findByUserId.mockResolvedValue(
      new Auth(mockCredential.userId, undefined, "mock-google-id"),
    );

    await expect(useCase.execute(loginInput)).rejects.toThrow(
      new BadRequestException("해당 이메일은 google로그인 계정입니다."),
    );
  });

  it("should throw BadRequestException if the password is incorrect", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    authRepository.findByUserId.mockResolvedValue(mockCredential);
    // 비밀번호 불일치
    passwordService.compare.mockResolvedValue(false);

    await expect(useCase.execute(loginInput)).rejects.toThrow(
      new BadRequestException("비밀번호가 틀렸습니다."),
    );
  });

  it("should return userId and accessToken if login is successful", async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    authRepository.findByUserId.mockResolvedValue(mockCredential);
    // 비밀번호 일치
    passwordService.compare.mockResolvedValue(true);
    tokenService.generateAccessToken.mockResolvedValue("mock-access-token");

    const result = await useCase.execute(loginInput);

    expect(result).toEqual({
      userId: 1,
      accessToken: "mock-access-token",
    });
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(
      1,
      "Tester",
      "test@gmail.com",
    );
  });
});
