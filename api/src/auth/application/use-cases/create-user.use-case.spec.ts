import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserUseCase } from "./create-user.use-case";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { PasswordService } from "src/auth/domain/services/password.service";
import { DataSource, QueryRunner } from "typeorm";
import { User } from "src/users/domain/entities/user.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let authRepository: jest.Mocked<AuthRepository>;
  let passwordService: jest.Mocked<PasswordService>;

  const userDto = {
    name: "Tester",
    email: "test@gmail.com",
    plainPassword: "1234",
  };

  const mockQueryRunner = {
    manager: {},
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  } as unknown as QueryRunner;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: { findByEmail: jest.fn(), save: jest.fn() },
        },
        { provide: AuthRepository, useValue: { save: jest.fn() } },
        { provide: PasswordService, useValue: { hash: jest.fn() } },
        {
          provide: DataSource,
          useValue: { createQueryRunner: jest.fn(() => mockQueryRunner) },
        },
      ],
    }).compile();

    useCase = module.get(CreateUserUseCase);
    userRepository = module.get(UserRepository);
    authRepository = module.get(AuthRepository);
    passwordService = module.get(PasswordService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should throw an error if user with email already exists", async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 2 } as User);

    await expect(useCase.execute(userDto)).rejects.toThrow(
      "사용중인 이메일 입니다.",
    );
  });

  it("should create user and credentials if email is not taken", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const mockUser = User.create(userDto.name, userDto.email);

    userRepository.save.mockImplementation((queryRunner, user) =>
      Promise.resolve({
        ...user,
        id: 1,
        createDate: new Date(),
      }),
    );

    passwordService.hash.mockResolvedValue("hashed-password");

    authRepository.save.mockResolvedValue(true);

    const result = await useCase.execute({
      ...mockUser,
      plainPassword: userDto.plainPassword,
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
    expect(userRepository.save).toHaveBeenCalled();
    expect(passwordService.hash).toHaveBeenCalledWith("1234");
    expect(authRepository.save).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Auth),
    );
    expect(result).toEqual(
      expect.objectContaining({
        name: "Tester",
        email: "test@gmail.com",
      }),
    );
  });
});
