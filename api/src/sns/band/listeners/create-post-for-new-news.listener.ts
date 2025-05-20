import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NewNewsEvent } from "src/post/domain/events/new-news.event";

@EventsHandler(NewNewsEvent)
export class CreatePostForNewNewsListener
  implements IEventHandler<NewNewsEvent>
{
  async handle(event: NewNewsEvent) {
    if (!process.env.BAND_KEY) {
      console.log("BAND_KEY is not set");
      return;
    }
    const content = `
    ${event.title}이 업로드 되었습니다.

    ${process.env.FRONTEND_URL}/news/${event.postId}

    상기 링크에서 확인해주세요!
    `;
    const params = new URLSearchParams();
    params.append("content", content);
    params.append("band_key", process.env.BAND_KEY);
    await fetch(
      `https://openapi.band.us/v2.2/band/post/create?access_token=${
        process.env.NAVER_BAND_ACCESS_TOKEN
      }`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: params,
      },
    );
  }
}
