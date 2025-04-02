import { Module } from "@nestjs/common";
import { PostService } from "./application/service/post.service";
import { PostController } from "./interface/post.controller";
import { PostRepository } from "./domain/repository/post.repository";
import { TypeormPostRepository } from "./infra/repository/typeorm-post.repository";

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: PostRepository,
      useClass: TypeormPostRepository,
    },
  ],
})
export class PostModule {}
