import { Module } from "@nestjs/common";
import { CleanUpUseCase } from "./application/use-cases/file-cleanup.use-case";
import { PostModule } from "src/post/post.module";
import { IFileService } from "./domain/filesystem/file.service";
import { FileService } from "./infra/filesystem/file.service";
import { ScheduleModule } from "@nestjs/schedule";
import { UnusedFileDelete } from "./infra/scheduler/unusedFile.service";

@Module({
  imports: [PostModule, ScheduleModule.forRoot()],
  providers: [
    CleanUpUseCase,
    {
      provide: IFileService,
      useClass: FileService,
    },
    UnusedFileDelete,
  ],
})
export class BatchModule {}
