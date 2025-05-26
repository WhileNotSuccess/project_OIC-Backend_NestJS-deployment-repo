import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CleanUpUseCase } from "src/batch/application/use-cases/file-cleanup.use-case";

@Injectable()
export class UnusedFileDelete {
  constructor(private readonly cleanUp: CleanUpUseCase) {}

  @Cron("0 0 4 * * 4")
  async deleteFiles() {
    await this.cleanUp.execute();
  }
}
