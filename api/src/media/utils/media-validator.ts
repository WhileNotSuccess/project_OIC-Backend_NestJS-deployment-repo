import * as fileType from "file-type";

export class MediaValidator {
  private static allowedImageMimeTypes = ["image/png", "image/jpeg"];
  private static allowedImageExt = ["png", "jpg", "jpeg"];
  private static imageMaxFileSize = 5 * 1024 * 1024; // 5MB
  private static allowedAttachmentMimeTypes = [
    // 문서
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    // 압축
    "application/zip",
    // 이미지
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/x-cfb",
  ];
  private static allowedAttachmentExt = [
    // 문서
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    // 압축
    "zip",
    // 이미지
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
  ];
  private static attachmentMaxFileSize = 50 * 1024 * 1024; // 50MB

  static async imageValidate(file: Express.Multer.File): Promise<void> {
    const type = await fileType.fromBuffer(file.buffer);
    const originalExt = file.originalname.match(/\.([a-zA-Z0-9]+)$/);
    if (!originalExt) {
      throw new Error("파일명에서 확장자를 찾을 수 없습니다.");
    }
    if (!type) {
      throw new Error("이미지 업로드 중 타입을 인식하지 못했습니다.");
    }
    if (!this.allowedImageMimeTypes.includes(type.mime)) {
      throw new Error(
        `이미지 업로드에서 허용되지 않은 MIME 타입입니다: ${type.mime}`,
      );
    }
    if (!this.allowedImageExt.includes(type.ext)) {
      throw new Error(
        `${type.ext}는 이미지 업로드에서 허용되지 않은 확장자입니다.`,
      );
    }
    if (!this.allowedImageExt.includes(originalExt[1])) {
      throw new Error(
        `${originalExt[1]}는 이미지 업로드에서 허용되지 않은 확장자입니다.`,
      );
    }

    if (file.buffer.length > this.imageMaxFileSize) {
      throw new Error(
        `이미지의 파일크기 제한은 ${MediaValidator.imageMaxFileSize}입니다. 파일 크기가 너무 큽니다: ${file.buffer.length}`,
      );
    }
  }

  static async attachmentValidate(file: Express.Multer.File) {
    const type = await fileType.fromBuffer(file.buffer);

    if (!type) {
      throw new Error("첨부파일 업로드 중 타입을 인식하지 못했습니다.");
    }
    const ext = type.ext.toLowerCase();

    const originalExt = file.originalname.match(/\.([a-zA-Z0-9]+)$/);
    if (!originalExt) {
      throw new Error("파일명에서 확장자를 찾을 수 없습니다.");
    }
    const isCfb = type.mime === "application/x-cfb";
    const isCfbAllowedExt = [".doc", ".xls", ".ppt"].includes(originalExt[1]);
    if (!this.allowedAttachmentMimeTypes.includes(type.mime)) {
      throw new Error(
        `첨부파일에서 허용되지 않은 MIME 타입입니다: ${type.mime}`,
      );
    }
    if (
      (!isCfb && !this.allowedAttachmentExt.includes(ext)) ||
      (isCfb && !isCfbAllowedExt)
    ) {
      throw new Error(`${type.ext} 는 첨부파일에 허용되지 않은 확장자 입니다.`);
    }
    if (!this.allowedAttachmentExt.includes(originalExt[1])) {
      throw new Error(
        `${originalExt[1]}는 첨부파일 업로드에서 허용되지 않은 확장자입니다.`,
      );
    }
    if (file.buffer.length > this.attachmentMaxFileSize) {
      throw new Error(
        `첨부파일의 파일 제한은 ${MediaValidator.attachmentMaxFileSize} 입니다. 파일 크기가 너무 큽니다: ${file.buffer.length}`,
      );
    }
    return {
      mimeType: type.mime,
      size: file.buffer.length,
    };
  }
}
