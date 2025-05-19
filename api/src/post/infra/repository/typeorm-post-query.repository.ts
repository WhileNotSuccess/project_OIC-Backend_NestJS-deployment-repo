import { Injectable } from "@nestjs/common";
import { Language } from "src/common/types/language";
import { PostWithAuthorDto } from "src/post/application/dto/post-with-author.dto";
import { PostQueryRepository } from "src/post/application/query/post-query.repository";
import { SearchTarget } from "src/post/domain/types/search-target.enum";
import { DataSource } from "typeorm";
import { PostOrmEntity } from "../entities/post-orm.entity";
import { UserOrmEntity } from "src/users/infra/entities/user.entity";
import { Post } from "src/post/domain/entities/post.entity";
import { User } from "src/users/domain/entities/user.entity";

@Injectable()
export class TypeormPostQueryRepository extends PostQueryRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async getOneWithAuthorById(
    postId: number,
  ): Promise<PostWithAuthorDto | null> {
    const post: PostWithAuthorDto[] = (await this.dataSource.manager
      .createQueryBuilder()
      .from(PostOrmEntity, "post")
      .leftJoin(UserOrmEntity, "user", "post.userId = user.id")
      .where("post.id = :postId", { postId })
      .select(
        "post.id AS id, post.title AS title, post.content AS content, post.category AS category, post.language AS language, post.createdDate AS createdDate, post.updatedDate AS updatedDate, user.name AS author, post.userId AS userId",
      )
      .getRawMany()) as unknown as PostWithAuthorDto[];

    if (post.length === 0) return null;

    return {
      title: post[0].title,
      content: post[0].content,
      author: post[0].author,
      userId: post[0].userId,
      category: post[0].category,
      language: post[0].language,
      createdDate: post[0].createdDate,
      updatedDate: post[0].updatedDate,
      id: post[0].id,
    };
  }

  async getManyWithAuthorByCategory(
    category: string,
    page: number,
    take: number,
    language: Language,
  ): Promise<[PostWithAuthorDto[], number]> {
    const [post, total] = (await this.dataSource.manager
      .createQueryBuilder(PostOrmEntity, "post")
      .leftJoin(UserOrmEntity, "user", "post.userId = user.id")
      .where("post.category = :category", { category })
      .andWhere("post.language = :language", { language })
      .take(take)
      .skip((page - 1) * take)
      .orderBy("post.updatedDate", "DESC")
      .getManyAndCount()) as unknown as [(Post & User)[], number];

    if (post.length === 0) return [[], 0];

    return [
      post.map((item) => ({
        title: item.title,
        content: item.content,
        author: item.name,
        userId: item.userId,
        category: item.category,
        language: item.language,
        createdDate: item.createdDate,
        updatedDate: item.updatedDate,
        id: item.id,
      })),
      total,
    ];
  }

  async search(
    target: SearchTarget,
    word: string,
    language: Language,
    category: string,
    page: number,
    limit: number,
  ): Promise<[PostWithAuthorDto[], number]> {
    const [post, total] = (await this.dataSource.manager
      .createQueryBuilder(PostOrmEntity, "post")
      .leftJoin(UserOrmEntity, "user", "post.userId = user.id")
      .where("post.category = :category", { category })
      .andWhere("post.language = :language", { language })
      .andWhere(
        target === SearchTarget.title
          ? "post.title LIKE :word"
          : "user.name LIKE :word",
        { word: `%${word}%` },
      )
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy("post.updatedDate", "DESC")
      .getManyAndCount()) as unknown as [(Post & User)[], number];

    if (post.length === 0) return [[], 0];

    return [
      post.map((item) => ({
        title: item.title,
        content: item.content,
        author: item.name,
        userId: item.userId,
        category: item.category,
        language: item.language,
        createdDate: item.createdDate,
        updatedDate: item.updatedDate,
        id: item.id,
      })),
      total,
    ];
  }
}
