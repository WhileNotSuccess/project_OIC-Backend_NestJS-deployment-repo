import { Test, TestingModule } from "@nestjs/testing";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { PasswordService } from "src/auth/domain/services/password.service";
import { TransactionManager } from "src/common/ports/transaction-manager.port";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { QueryRunner } from "typeorm";
import { ChangePasswordUseCase } from "./change-password.use-case";

describe("ChangePassword", () => {
  let useCase: ChangePasswordUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let transaction: jest.Mocked<TransactionManager>;

  const mockUser = { id: 1 } as Express.User;
  const oldPassword = "oldPass";
  const newPassword = "newPass";
  const hashedPassword = "hashedOldPass";
  const newHashedPassword = "hashedNewPass";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordUseCase,
        {
          provide: AuthRepository,
          useValue: {
            findByUserId: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            compare: jest.fn(),
            hash: jest.fn(),
          },
        },
        {
          provide: TransactionManager,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ChangePasswordUseCase>(ChangePasswordUseCase);
    authRepository = module.get(AuthRepository);
    passwordService = module.get(PasswordService);
    transaction = module.get(TransactionManager);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should throw if userId or new password is missing", async () => {
    await expect(
      useCase.execute({} as Express.User, oldPassword, newPassword),
    ).rejects.toThrow("정보가 잘못 되었습니다.");
  });

  it("should throw if user not found", async () => {
    authRepository.findByUserId.mockResolvedValue(null);

    await expect(
      useCase.execute(mockUser, oldPassword, newPassword),
    ).rejects.toThrow("유저 정보를 다시 확인해 주세요.");
  });

  it("should throw if user has no hashed password (Google user)", async () => {
    authRepository.findByUserId.mockResolvedValue({
      hashedPassword: null,
    } as unknown as Auth);

    await expect(
      useCase.execute(mockUser, oldPassword, newPassword),
    ).rejects.toThrow("해당 유저는 구글 계정입니다.");
  });

  it("should throw if password does not match", async () => {
    authRepository.findByUserId.mockResolvedValue({
      hashedPassword,
    } as Auth);

    passwordService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute(mockUser, oldPassword, newPassword),
    ).rejects.toThrow("계정 정보를 다시 확인해 주세요.");
  });

  it("should update the password successfully", async () => {
    const authEntity = {
      hashedPassword,
      updatePassword: jest.fn(),
    } as unknown as Auth;

    authRepository.findByUserId.mockResolvedValue(authEntity);
    passwordService.compare.mockResolvedValue(true);
    passwordService.hash.mockResolvedValue(newHashedPassword);
    transaction.execute.mockImplementation(async (cb) => {
      const queryRunner = {} as QueryRunner;
      return cb(queryRunner);
    });

    await useCase.execute(mockUser, oldPassword, newPassword);

    expect(passwordService.compare).toHaveBeenCalledWith(
      oldPassword,
      hashedPassword,
    );
    expect(passwordService.hash).toHaveBeenCalledWith(newPassword);
    expect(authEntity.updatePassword).toHaveBeenCalledWith(newHashedPassword);
    expect(authRepository.save).toHaveBeenCalled();
  });
});
