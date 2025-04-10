import { Post } from "../entities/post.entity";

export abstract class PostRepository {
  abstract getOne(id: number): Promise<Post | null>;
  abstract create(dto: Partial<Post>): Promise<Post>;
  abstract getAll(): Promise<Post[]>;
  abstract update(id: number, dto: Partial<Post>): Promise<Post | null>;
  abstract delete(id: number): Promise<boolean>;
}
