import { Post } from "src/post/domain/entities/post.entity";
import { PostRepository } from "src/post/domain/repository/post.repository";
import { DataSource } from "typeorm";
import { PostOrmEntity } from "../entities/post-orm.entity";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { imageMetadata } from "src/media/domain/image-metadata";
import { News } from "src/post/domain/types/news";
import { UploadAttachmentReturn } from "src/media/domain/upload-attachment";
import { AttachmentOrmEntity } from "../entities/attachment-orm.entity";
import {
  toDomainAttachment,
  toDomainPost,
  toDomainPostImage,
} from "../mapper/to-domain";
import { transactional } from "src/common/utils/transaction-helper";
import { PostImageOrmEntity } from "../entities/post-image-orm.entity";
import { PostImage } from "src/post/domain/entities/post-image.entity";
import { Attachment } from "src/post/domain/entities/attachment.entity";
import * as path from "path";

@Injectable()
export class TypeormPostRepository extends PostRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async getAttachmentsByPostId(postId: number): Promise<Attachment[]> {
    const result = await this.dataSource.manager.findBy(AttachmentOrmEntity, {
      postId,
    });
    return result.map((item) => toDomainAttachment(item));
  }

  async getOneForCategory(
    category: string,
    language: string,
  ): Promise<Post | null> {
    const post = await this.dataSource.manager
      .createQueryBuilder()
      .select("posts")
      .from(PostOrmEntity, "posts")
      .where("category LIKE :category", { category: category })
      .andWhere("language LIKE :language", { language })
      .orderBy("updatedDate", "DESC")
      .getOne();
    if (!post) {
      return null;
    }
    return toDomainPost(post);
  }
  async create(
    dto: Partial<Post>,
    imageData: imageMetadata[],
    filesData: UploadAttachmentReturn[],
  ): Promise<Post> {
    const postOrm = await transactional<PostOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        const post = await queryRunner.manager.save(PostOrmEntity, dto);
        const postId = post.id;
        await Promise.all(
          imageData.map(async (item) => {
            return await queryRunner.manager.save(PostImageOrmEntity, {
              fileSize: item.size,
              filename: item.filename,
              postId,
            });
          }),
        );
        await Promise.all(
          filesData.map(async (item) => {
            return await queryRunner.manager.save(AttachmentOrmEntity, {
              postId,
              url: item.url,
              originalName: item.originalname,
            });
          }),
        );
        return post;
      },
    );

    const result = toDomainPost(postOrm);
    if (!result) {
      throw new InternalServerErrorException(
        "post 저장중 에러가 발생했습니다.",
      );
    }
    return result;
  }

  async update(
    id: number,
    dto: Partial<Post>,
    deleteFilePath: string[],
    imageData: imageMetadata[],
    filesData: UploadAttachmentReturn[],
    deleteImages: string[],
  ): Promise<void> {
    await transactional<void>(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(PostOrmEntity, id, dto);
      await Promise.all(
        imageData.map(async (item) => {
          return await queryRunner.manager.save(PostImageOrmEntity, {
            filename: item.filename,
            fileSize: item.size,
            postId: id,
          });
        }),
      );
      await Promise.all(
        deleteImages.map(async (item) => {
          return await queryRunner.manager.delete(PostImageOrmEntity, {
            filename: item,
          });
        }),
      );
      await Promise.all(
        filesData.map(async (item) => {
          return await queryRunner.manager.save(AttachmentOrmEntity, {
            postId: id,
            url: item.url,
            originalName: item.originalname,
          });
        }),
      );
      await Promise.all(
        deleteFilePath.map(async (item) => {
          return await queryRunner.manager.delete(AttachmentOrmEntity, {
            originalName: item,
          });
        }),
      );
    });
  }
  async findImagesWithPostId(postId: number): Promise<PostImage[]> {
    const result = await this.dataSource.manager.findBy(PostImageOrmEntity, {
      postId,
    });
    const domains = result.map((item) => toDomainPostImage(item));
    return domains;
  }
  async delete(id: number): Promise<boolean> {
    const deleteResult = await transactional<boolean>(
      this.dataSource,
      async (queryRunner) => {
        const result = await queryRunner.manager.delete(PostOrmEntity, id);
        return typeof result.affected === "number" && result.affected > 0;
      },
    );

    return deleteResult;
  }

  async getNews(language: string): Promise<News[]> {
    const posts = await this.dataSource.manager
      .createQueryBuilder()
      .select("posts")
      .from(PostOrmEntity, "posts")
      .where("category LIKE :category", { category: "news" })
      .andWhere("language LIKE :language", { language })
      .orderBy("id", "DESC")
      .take(10)
      .getMany();

    const news = posts.map((item) => {
      return {
        postId: item.id,
        content: item.content,
        title: item.title,
        date: item.createdDate.toISOString(),
      };
    });

    return news;
  }

  async getFilenames(): Promise<string[]> {
    const filenames = await this.dataSource.manager
      .createQueryBuilder(AttachmentOrmEntity, "attach")
      .select("attach.url")
      .getMany();
    const imageNames = await this.dataSource.manager
      .createQueryBuilder(PostImageOrmEntity, "image")
      .select("image.filename")
      .getMany();
    const newFilenames = [
      ...filenames.map((i) => path.join("/files", i.url)),
      ...imageNames.map((i) => path.join("/files", i.filename)),
    ];

    return newFilenames;
  }
}
