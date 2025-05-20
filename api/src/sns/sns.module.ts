import { Module } from "@nestjs/common";
import { CreatePostForNewNewsListener } from "./band/listeners/create-post-for-new-news.listener";

@Module({
  providers: [CreatePostForNewNewsListener],
})
export class SnsModule {}
