import { Module } from "@nestjs/common";
import { PostService } from "./application/service/post.service";
import { PostController } from "./interface/post.controller";
import { PostRepository } from "./domain/repository/post.repository";
import { TypeormPostRepository } from "./infra/repository/typeorm-post.repository";
import { MediaModule } from "src/media/media.module";
import { HtmlParserPort } from "./application/port/html-parser.port";
import { JSDOMHtmlParserService } from "./infra/html-parser/jsdom-html-parser-service";

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
  ],
})
export class PostModule {}
