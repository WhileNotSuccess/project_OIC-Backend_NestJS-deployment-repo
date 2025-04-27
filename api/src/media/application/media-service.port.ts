import { imageMetadata } from "../domain/image-metadata";
import { UploadAttachmentReturn } from "../domain/upload-attachment";

export abstract class MediaServicePort {
  abstract uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string>;
  abstract uploadAttachment(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadAttachmentReturn>;
  abstract findImage(filenames: string[]): Promise<imageMetadata[]>;
  abstract delete(filePaths: string[]): Promise<void>;
}
