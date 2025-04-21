import { Post } from "src/post/domain/entities/post.entity";
import { PostOrmEntity } from "../entities/post-orm.entity";
import { AttachmentOrmEntity } from "../entities/attachment-orm.entity";
import { PostImageOrmEntity } from "../entities/post-image-orm.entity";
import { Attachment } from "src/post/domain/entities/attachment.entity";
import { PostImage } from "src/post/domain/entities/post-image.entity";

export const toDomainPost = (post: PostOrmEntity) => {
  const domain = new Post(
    post.title,
    post.content,
    post.userId,
    post.category,
    post.language,
    post.createdDate,
    post.updatedDate,
    post.id,
  );
  return domain;
};

export const toDomainAttachment = (attachment: AttachmentOrmEntity) => {
  const domain = new Attachment(
    attachment.postId,
    attachment.originalName,
    attachment.url,
    attachment.id,
  );
  return domain;
};

export const toDomainPostImage = (postImage: PostImageOrmEntity) => {
  const domain = new PostImage(
    postImage.postId,
    postImage.filename,
    postImage.fileSize,
    postImage.id,
  );
  return domain;
};
