import { Post } from "src/post/domain/entities/post.entity";
import { PostOrmEntity } from "../entities/post-orm.entity";

export const toDomain = (post: PostOrmEntity) => {
  const domain = new Post(post.title, post.content, post.author);
  return domain;
};
