import { CleanUpUseCase } from "./file-cleanup.use-case";
import { IFileService } from "src/batch/domain/filesystem/file.service";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { Test, TestingModule } from "@nestjs/testing";

describe("CleanUpUseCase", () => {
  let cleanUpUseCase: CleanUpUseCase;
  let mockFileService: jest.Mocked<IFileService>;
  let mockPostRepository: jest.Mocked<PostRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanUpUseCase,
        {
          provide: IFileService,
          useValue: {
            getAllFiles: jest.fn(),
            deleteFiles: jest.fn(),
            deleteEmptyDirectory: jest.fn(),
          },
        },
        {
          provide: PostRepository,
          useValue: {
            getFilenames: jest.fn(),
          },
        },
      ],
    }).compile();
    cleanUpUseCase = module.get(CleanUpUseCase);
    mockFileService = module.get(IFileService);
    mockPostRepository = module.get(PostRepository);
  });

  it("should delete unused files and empty directories", async () => {
    // db에 저장된 파일 이름
    const filesInServer = ["a.jpg", "b.jpg", "c.jpg"];
    // 서버에 저장된 파일 이름
    const filesInDatabase = ["b.jpg"];
    // 삭제할 파일 이름
    const expectedToDelete = ["a.jpg", "c.jpg"];

    mockFileService.getAllFiles.mockReturnValue(filesInServer);
    mockPostRepository.getFilenames.mockResolvedValue(filesInDatabase);

    await cleanUpUseCase.execute();

    expect(mockFileService.getAllFiles).toHaveBeenCalledWith("/files");
    expect(mockPostRepository.getFilenames).toHaveBeenCalled();
    expect(mockFileService.deleteFiles).toHaveBeenCalledWith(expectedToDelete);
    expect(mockFileService.deleteEmptyDirectory).toHaveBeenCalledWith("/files");
  });

  it("should not delete files if all are used", async () => {
    const filesInServer = ["a.jpg", "b.jpg"];
    const filesInDatabase = ["a.jpg", "b.jpg"];

    mockFileService.getAllFiles.mockReturnValue(filesInServer);
    mockPostRepository.getFilenames.mockResolvedValue(filesInDatabase);

    await cleanUpUseCase.execute();

    expect(mockFileService.deleteFiles).toHaveBeenCalledWith([]);
    expect(mockFileService.deleteEmptyDirectory).toHaveBeenCalledWith("/files");
  });
});
