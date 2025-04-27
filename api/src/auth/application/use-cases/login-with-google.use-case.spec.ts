import { Test, TestingModule } from "@nestjs/testing";
import { LoginWithGoogleUseCase } from "./login-with-google.use-case";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { TokenService } from "../services/token.service";
import { User } from "src/users/domain/entities/user.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";

describe("LoginWithGoogleUseCase", () => {
  let useCase: LoginWithGoogleUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let tokenService: jest.Mocked<TokenService>;

  const mockUser = { id: 1, email: "test@gmail.com", name: "Tester" } as User;
  const mockAuth = { userId: 1, googleId: "google123" } as Auth;

  const loginWithGoogleInput = { googleId: "google123" };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginWithGoogleUseCase,
        { provide: AuthRepository, useValue: { findByGoogleId: jest.fn() } },
        { provide: UserRepository, useValue: { findById: jest.fn() } },
        { provide: TokenService, useValue: { generateAccessToken: jest.fn() } },
      ],
    }).compile();

    useCase = module.get(LoginWithGoogleUseCase);
    authRepository = module.get(AuthRepository);
    userRepository = module.get(UserRepository);
    tokenService = module.get(TokenService);
  });

  it("should throw an error if no user is linked with the googleId", async () => {
    authRepository.findByGoogleId.mockResolvedValue(null);

    await expect(useCase.execute(loginWithGoogleInput)).rejects.toThrow(
      new Error("연결된 계정을 찾을 수 없습니다."),
    );
  });

  it("should throw an error if user is not found by userId", async () => {
    authRepository.findByGoogleId.mockResolvedValue(mockAuth);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(loginWithGoogleInput)).rejects.toThrow(
      new Error("연결된 계정을 찾을 수 없습니다."),
    );
  });

  it("should generate and return access token when successful", async () => {
    authRepository.findByGoogleId.mockResolvedValue(mockAuth);
    userRepository.findById.mockResolvedValue(mockUser);
    tokenService.generateAccessToken.mockResolvedValue("mock-access-token");

    const result = await useCase.execute(loginWithGoogleInput);

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
