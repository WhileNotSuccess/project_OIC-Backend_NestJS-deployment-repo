import { imageMetadata } from "src/media/domain/image-metadata";
import { Post } from "../entities/post.entity";
import { News } from "../types/news";
import { UploadAttachmentReturn } from "src/media/domain/upload-attachment";
import { Language } from "../../../common/types/language";
import { PostImage } from "../entities/post-image.entity";
import { Attachment } from "../entities/attachment.entity";

export abstract class PostRepository {
  abstract getAttachmentsByPostId(postId: number): Promise<Attachment[]>;

  abstract getOneForCategory(
    category: string,
    language: Language,
  ): Promise<Post | null>;
  abstract create(
    dto: Partial<Post>,
    imageData: imageMetadata[],
    filesData: UploadAttachmentReturn[],
  ): Promise<Post>;

  abstract update(
    id: number,
    dto: Partial<Post>,
    deleteFilePath: string[],
    imageData: imageMetadata[],
    filesData: UploadAttachmentReturn[],
    deleteImages: string[],
  ): Promise<void>;

  abstract findImagesWithPostId(postId: number): Promise<PostImage[]>;
  abstract delete(id: number): Promise<boolean>;
  abstract getNews(language: Language): Promise<News[]>;
  abstract getFilenames(): Promise<string[]>;
}
