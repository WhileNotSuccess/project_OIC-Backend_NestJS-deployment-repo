import { NewNewsEventX } from "src/post/domain/events/new-news-X.event";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import * as fs from "fs";
import { lookup } from "mime-types";
import { ApiResponseError, TwitterApi } from "twitter-api-v2";
import * as path from "path";

@EventsHandler(NewNewsEventX)
export class CreatePostForNewNewsListenerX
  implements IEventHandler<NewNewsEventX>
{
  async handle(event: NewNewsEventX) {
    const X_key = {
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_KEY_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
    };
    // 발급 받은 키로 X api 생성
    const client = new TwitterApi(X_key);

    // 업로드 할 내용
    const content = [
      `${event.title}이 업로드 되었습니다.`,
      `${process.env.FRONTEND_URL}/board/news/${event.postId}`,
    ].join("\n\n");

    try {
      let mediaId: string | undefined;
      if (event.media) {
        const mediaPath = path.resolve(__dirname, "../../../../../files");
        const filePath = path.join(mediaPath, event.media);
        if (!fs.existsSync(filePath)) {
          console.warn("해당 미디어 파일이 존재하지 않습니다.", filePath);
        } else {
          const media = fs.readFileSync(filePath);
          const mimeType = lookup(filePath) || "application/octet-stream";

          mediaId = await client.v1.uploadMedia(media, {
            mimeType,
          });
        }
      }

      // X에 업로드
      await client.v2.tweet(
        mediaId
          ? { text: content, media: { media_ids: [mediaId] } }
          : { text: content },
      );
    } catch (e) {
      if (e instanceof ApiResponseError) {
        console.error("에러 메시지:", e);
      } else {
        console.error("알 수 없는 에러:", e);
      }
    }
  }
}
