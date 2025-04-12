import { Module } from "@nestjs/common";
import { PostService } from "./application/service/post.service";
import { PostController } from "./interface/post.controller";
import { PostRepository } from "./domain/repository/post.repository";
import { TypeormPostRepository } from "./infra/repository/typeorm-post.repository";
import { MediaModule } from "src/media/media.module";

@Module({
  imports: [MediaModule],
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
