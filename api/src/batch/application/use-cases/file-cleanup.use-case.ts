import { Injectable } from "@nestjs/common";
import { IFileService } from "src/batch/domain/filesystem/file.service";
import { PostRepository } from "src/post/domain/repository/post.repository";

@Injectable()
export class CleanUpUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly fileService: IFileService,
  ) {}
  async execute() {
    // 서버에 저장되어 있는 모든 파일
    const filesInServer = this.fileService.getAllFiles(`/files`);

    // db에 저장되어 있는 모든 파일 이름
    const filesInDatabase = await this.postRepository.getFilenames();

    // 서버에 저장된 파일 중에 사용되고 있는 파일을 제외하고 사용되지 않는 파일들의 배열을 생성
    const deleteFiles = filesInServer.filter(
      (item) => !filesInDatabase.includes(item),
    );

    // 사용되지 않는 파일 삭제
    this.fileService.deleteFiles(deleteFiles);
    // 빈 폴더 삭제
    this.fileService.deleteEmptyDirectory(`/files`);
  }
}
