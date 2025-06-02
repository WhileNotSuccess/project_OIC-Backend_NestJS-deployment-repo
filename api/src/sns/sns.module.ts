import { Module } from "@nestjs/common";
import { CreatePostForNewNewsListenerBand } from "./band/listeners/create-post-for-new-news-band.listener";
import { CreatePostForNewNewsListenerX } from "./X/listeners/create-post-for-new-news-X.listener";

@Module({
  providers: [CreatePostForNewNewsListenerBand, CreatePostForNewNewsListenerX],
})
export class SnsModule {}
