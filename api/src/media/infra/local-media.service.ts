import { Injectable, Logger } from "@nestjs/common";
import * as path from "path";
import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";
import { MediaService } from "../domain/media.service";
import { MediaValidator } from "../utils/media-validator";

@Injectable()
export class LocalMediaService extends MediaService {
  private readonly uploadRoot = path.resolve(__dirname, "../../../../files");
  async findImage(filenames: string[]) {
    const results = await Promise.allSettled(
      filenames.map(async (file) => {
        const fileData = await fs.readFile(path.join(this.uploadRoot, file));
        return {
          size: fileData.buffer.byteLength,
          filename: file,
        };
      }),
    );

    const successful = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          size: number;
          filename: string;
        }> => result.status === "fulfilled",
      )
      .map((result) => result.value);

    results
      .filter((result) => result.status === "rejected")
      .forEach((result, i) => {
        Logger.warn(`${filenames[i]} 파일을 로드하지 못했습니다.`);
      });

    return successful;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    await MediaValidator.imageValidate(file);
    const fileName = `${uuid()}-${file.originalname}`;
    const targetDir = path.join(this.uploadRoot, folder);
    const targetPath = path.join(targetDir, fileName);

    await fs.mkdir(targetDir, { recursive: true });

    await fs.writeFile(targetPath, file.buffer);

    return `/${folder}/${fileName}`;
  }

  async uploadAttachment(file: Express.Multer.File, folder: string) {
    const { mimeType, size } = await MediaValidator.attachmentValidate(file);
    const savedFileName = `${uuid()}.${path.basename(file.originalname)}`;
    const originalname = file.originalname;
    const targetDir = path.join(this.uploadRoot, folder);
    const targetPath = path.join(targetDir, savedFileName);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetPath, file.buffer);

    return {
      mimeType,
      size,
      originalname,
      url: `/${folder}/${savedFileName}`,
    };
  }

  async delete(filePaths: string[]): Promise<void> {
    const deletedPromises = filePaths.map(async (item) => {
      try {
        await fs.unlink(path.join(this.uploadRoot, item));
      } catch {
        Logger.warn(`${item} 을 삭제하지 못했습니다.`);
      }
    });

    await Promise.all(deletedPromises);
  }
}
