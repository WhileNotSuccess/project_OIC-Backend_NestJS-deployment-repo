type UploadAttachmentReturn = {
  originalname: string;
  mimeType: string;
  size: number;
  url: string;
};
export abstract class MediaService {
  abstract uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string>;
  abstract uploadAttachment(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadAttachmentReturn>;
  abstract delete(filePaths: string[]): Promise<void>;
}
