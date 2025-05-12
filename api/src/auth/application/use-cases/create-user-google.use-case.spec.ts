import { CreateGoogleUserUseCase } from "./create-user-google.use-case";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { User } from "src/users/domain/entities/user.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { TransactionManager } from "src/common/ports/transaction-manager.port";
import { QueryRunner } from "typeorm";

describe("CreateGoogleUserUseCase", () => {
  let useCase: CreateGoogleUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let authRepository: jest.Mocked<AuthRepository>;
  let transactionManager: jest.Mocked<TransactionManager>;

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
        CreateGoogleUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: AuthRepository, useValue: { save: jest.fn() } },
        {
          provide: TransactionManager,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();
    useCase = module.get<CreateGoogleUserUseCase>(CreateGoogleUserUseCase);
    userRepository = module.get(UserRepository);
    authRepository = module.get(AuthRepository);
    transactionManager = module.get(TransactionManager);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
    jest.spyOn(transactionManager, "execute").mockResolvedValue(userDto);
  });

  it("should throw an error if user with email already exists", async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 2 } as User);
    // 비동기 함수가 에러를 던질것으로 예상 될때 쓰는 .rejects
    // await expect(asyncFunction()).rejects.toThrow("에러 메시지");
    // asyncFunction()은 에러를 던질 것이고 그 에러 메시지는 "에러 메시지"와 일치해야 한다.
    await expect(
      useCase.execute({
        name: userDto.name,
        email: userDto.email,
        googleId: authDto.googleId,
      }),
    ).rejects.toThrow("사용중인 이메일 입니다.");
  });

  it("should create user and credentials if email is not taken", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const mockUser = new User("Tester", "test@gmail.com");
    jest.spyOn(userRepository, "save").mockResolvedValue(mockUser);
    // 들어온 user에 id와 createDate를 붙여 db에 저장된 것 처럼 보이게 함
    userRepository.save.mockImplementation((queryRunner, user) => {
      // .save 는 Promise<User>를 반환하므로 Promise.resolve를 써서 Promise 객체로 반환되게 만듬
      // async await은 비동기 시킬 동작이 없다고 ESLint가 에러
      return Promise.resolve({
        ...user,
        id: 1,
        createDate: userDto.createDate,
      });
    });
    // mockResolvedValue 는 정해진 값만 return 하고 싶을때
    // mockImplementation은 입력값에 따라 다른 동작을 실행시키고 싶을때

    authRepository.save.mockResolvedValue(true);
    transactionManager.execute.mockImplementation(async (cb) => {
      const queryRunner = {} as QueryRunner;
      return cb(queryRunner);
    });
    const result = await useCase.execute({
      ...mockUser,
      googleId: authDto.googleId,
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@gmail.com");
    expect(userRepository.save).toHaveBeenCalled();
    expect(authRepository.save).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Auth),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        name: "Tester",
        email: "test@gmail.com",
      }),
    );
  });
});
