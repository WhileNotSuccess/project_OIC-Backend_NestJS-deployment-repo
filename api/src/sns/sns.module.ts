import { Module } from "@nestjs/common";
import { CreatePostForNewNewsListenerBand } from "./band/listeners/create-post-for-new-news-band.listener";
import { CreatePostForNewNewsListenerX } from "./X/listeners/create-post-for-new-news-X.listener";
import { CreatePostForNewNewsListenerThreads } from "./threads/listeners/create-post-for-new-news-threads.listener";

@Module({
  providers: [
    CreatePostForNewNewsListenerBand,
    CreatePostForNewNewsListenerX,
    CreatePostForNewNewsListenerThreads,
  ],
})
export class SnsModule {}
