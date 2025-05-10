import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { LinkGoogleUseCase } from "./link-google.use-case";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { TokenService } from "../services/token.service";
import { TransactionManager } from "src/common/ports/transaction-manager.port";
import { Test, TestingModule } from "@nestjs/testing";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { User } from "src/users/domain/entities/user.entity";
import { QueryRunner } from "typeorm";

describe("LinkGoogleUseCase", () => {
  let useCase: LinkGoogleUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let tokenService: jest.Mocked<TokenService>;
  let transaction: jest.Mocked<TransactionManager>;

  const userDto = {
    id: 1,
    name: "tester",
    createDate: new Date(),
    email: "test@gmail.com",
  };
  const authDto = {
    userId: 1,
    password: "1234",
    googleId: "12345678",
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkGoogleUseCase,
        {
          provide: AuthRepository,
          useValue: {
            save: jest.fn(),
            findByGoogleId: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: TokenService, useValue: { generateAccessToken: jest.fn() } },
        {
          provide: TransactionManager,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();
    useCase = module.get<LinkGoogleUseCase>(LinkGoogleUseCase);
    userRepository = module.get(UserRepository);
    authRepository = module.get(AuthRepository);
    tokenService = module.get(TokenService);
    transaction = module.get(TransactionManager);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should throw if googleId is missing", async () => {
    await expect(useCase.execute(userDto, "")).rejects.toThrow(
      "정보가 잘못 되었습니다.",
    );
  });

  it("should throw an error if googleId is already linked", async () => {
    authRepository.findByGoogleId.mockResolvedValueOnce({ userId: 2 } as Auth);
    await expect(useCase.execute(userDto, authDto.googleId)).rejects.toThrow(
      "이미 가입되어있는 구글 계정입니다.",
    );
  });
  it("should throw if email does not match jwtUser.id", async () => {
    authRepository.findByGoogleId.mockResolvedValueOnce(null);
    userRepository.findByEmail.mockResolvedValueOnce({ id: 2 } as User);

    await expect(useCase.execute(userDto, authDto.googleId)).rejects.toThrow(
      "토큰 정보가 변질되었습니다.",
    );
  });

  it("should throw if auth info is missing", async () => {
    authRepository.findByGoogleId.mockResolvedValueOnce(null);
    userRepository.findByEmail.mockResolvedValueOnce(userDto);
    authRepository.findByUserId.mockResolvedValueOnce(null);

    await expect(useCase.execute(userDto, authDto.googleId)).rejects.toThrow(
      "auth 정보가 등록되어 있지 않습니다.",
    );
  });

  it("should link google id and return token", async () => {
    const fakeAuth = {
      ...authDto,
      linkGoogleId: jest.fn(),
      updatePassword: jest.fn(),
    };

    authRepository.findByGoogleId.mockResolvedValueOnce(null);
    userRepository.findByEmail.mockResolvedValueOnce(userDto);
    authRepository.findByUserId.mockResolvedValueOnce(fakeAuth);
    tokenService.generateAccessToken.mockResolvedValueOnce("new-token");
    transaction.execute.mockImplementation(async (cb) => {
      const queryRunner = {} as QueryRunner;
      return cb(queryRunner);
    });

    const result = await useCase.execute(userDto, authDto.googleId);

    expect(fakeAuth.linkGoogleId).toHaveBeenCalledWith(authDto.googleId);
    expect(authRepository.save).toHaveBeenCalled();
    expect(result).toBe("new-token");
  });
});
