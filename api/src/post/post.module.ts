import { Module } from "@nestjs/common";
import { PostService } from "./application/service/post.service";
import { PostController } from "./interface/post.controller";
import { PostRepository } from "./domain/repository/post.repository";
import { TypeormPostRepository } from "./infra/repository/typeorm-post.repository";
import { MediaModule } from "src/media/media.module";
import { HtmlParserPort } from "./application/port/html-parser.port";
import { JSDOMHtmlParserService } from "./infra/html-parser/jsdom-html-parser-service";
import { PostQueryRepository } from "./application/query/post-query.repository";
import { TypeormPostQueryRepository } from "./infra/repository/typeorm-post-query.repository";

@Module({
  imports: [MediaModule],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: PostRepository,
      useClass: TypeormPostRepository,
    },
    {
      provide: HtmlParserPort,
      useClass: JSDOMHtmlParserService,
    },
    {
      provide: PostQueryRepository,
      useClass: TypeormPostQueryRepository,
    },
  ],
})
export class PostModule {}
