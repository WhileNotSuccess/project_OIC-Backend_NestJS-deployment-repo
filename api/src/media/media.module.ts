import { Module } from "@nestjs/common";
import { LocalMediaService } from "./infra/local-media.service";
import { MediaServicePort } from "./application/media-service.port";

@Module({
  providers: [
    {
      provide: MediaServicePort,
      useClass: LocalMediaService,
    },
  ],
  exports: [MediaServicePort],
})
export class MediaModule {}
