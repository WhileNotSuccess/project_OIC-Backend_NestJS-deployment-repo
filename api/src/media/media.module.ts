import { Module } from "@nestjs/common";
import { MediaService } from "./domain/media.service";
import { LocalMediaService } from "./infra/local-media.service";

@Module({
  providers: [
    {
      provide: MediaService,
      useClass: LocalMediaService,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
