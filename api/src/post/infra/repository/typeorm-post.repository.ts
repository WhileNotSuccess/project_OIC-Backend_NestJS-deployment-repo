import { Post } from "src/post/domain/entities/post.entity";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { DataSource } from "typeorm";
import { PostOrmEntity } from "../entities/post-orm.entity";
import { toDomain } from "../mapper/to-domain";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormPostRepository extends PostRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async getOne(id: number): Promise<Post | null> {
    const orm = await this.dataSource.manager.findOneBy(PostOrmEntity, { id });

    return orm ? toDomain(orm) : null;
  }
  async create(dto: Partial<Post>): Promise<Post> {
    const post = new Post(dto.title, dto.content, dto.author, dto.id);

    await this.dataSource.manager.save(PostOrmEntity, post);
    return post;
  }
  async getAll(): Promise<Post[]> {
    const posts = await this.dataSource.manager.find(PostOrmEntity);
    return posts.map((item) => toDomain(item));
  }
  async update(id: number, dto: Partial<Post>): Promise<Post | null> {
    const existing = await this.getOne(id);
    if (!existing) return null;
    const updated = new Post(
      dto.title ?? existing.title,
      dto.content ?? existing.content,
      dto.author ?? existing.author,
      id,
    );
    await this.dataSource.manager.update(PostOrmEntity, { id }, updated);
    return await this.getOne(id);
  }
  async delete(id: number): Promise<boolean> {
    return (
      (await this.dataSource.manager.delete(PostOrmEntity, { id })).affected !==
      0
    );
  }
}
