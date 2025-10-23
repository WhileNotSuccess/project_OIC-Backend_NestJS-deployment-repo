import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NewNewsEventThreads } from "src/post/domain/events/new-news-threads.event";
import * as path from "path";
import * as fs from "fs";

@EventsHandler(NewNewsEventThreads)
export class CreatePostForNewNewsListenerThreads
  implements IEventHandler<NewNewsEventThreads>
{
  async handle(event: NewNewsEventThreads) {
    if (!process.env.THREADS_USER_ID && !process.env.THREADS_ACCESS_TOKEN) {
      console.warn("THREADS_KEY isn't setting");
      return;
    }

    const baseURL = `https://graph.threads.net/v1.0/${process.env.THREADS_USER_ID}`;
    const accessor = `?access_token=${process.env.THREADS_ACCESS_TOKEN}`;

    const content = `영진전문대학교 국제교류원에서 새로운 공지가 올라왔습니다!\n${event.title} 소식을 만나보세요!\n${process.env.FRONTEND_URL}/board/news/${event.postId}`;

    let filePath: string|undefined;

    try {
      // 올려야 할 미디어 파일이 있을 경우
      if (event.media) {
        const mediaPath = path.resolve(__dirname, "../../../../../files");
        filePath = path.join(mediaPath, event.media);

        if (!fs.existsSync(filePath)) {
          // 서버에 파일이 저장되어있지 않은 경우
          console.warn("해당 미디어 파일이 존재하지 않습니다.", filePath);
        }
      }

      // 미디어 컨테이너 만들기
      const response = await fetch(
        [
          `${baseURL}/threads${accessor}`,
          `media_type=${event.media ? "IMAGE" : "TEXT"}`, // 게시 타입 TEXT, IMAGE, VIDEO
          `text=${content}`,
          `domain=THREADS`,
          `${filePath ? `image_url=${process.env.BACKEND_URL}${filePath}` : null}`,
        ].join("&"),
        { method: "POST" },
      );
      
      const resJson = (await response.json()) as { id: number }; // {id:number}
      console.log(resJson)

      // 미디어 컨테이너 게시
      const conRes = await fetch(
        [
          `${baseURL}/threads_publish${accessor}`,
          `domain=THREADS`,
          `creation_id=${resJson.id}`,
        ].join("&"),
        { method: "POST" },
      );
      console.log(conRes)
    } catch (e) {
      if (e) {
        console.error("에러 메시지:", e);
      } else {
        console.error("알 수 없는 에러:", e);
      }
    }
  }
}
