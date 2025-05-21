import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NewNewsEvent } from "src/post/domain/events/new-news.event";

@EventsHandler(NewNewsEvent)
export class CreatePostForNewNewsListener
  implements IEventHandler<NewNewsEvent>
{
  async handle(event: NewNewsEvent) {
    // 환경변수 확인
    if (!process.env.BAND_KEY) {
      console.warn("BAND_KEY is not set");
      return;
    }

    // 밴드에 올릴 글 내용
    const content = [
      `${event.title}이 업로드 되었습니다.`,
      `${process.env.FRONTEND_URL}/news/${event.postId}`,
      `상기 링크에서 확인해주세요!`,
    ].join("\n\n");

    // 밴드 API에 요청할 파라미터
    const params = new URLSearchParams();
    params.append("content", content);
    params.append("band_key", process.env.BAND_KEY);

    // 밴드 API에 요청
    try {
      const response = await fetch(
        `https://openapi.band.us/v2.2/band/post/create?access_token=${process.env.NAVER_BAND_ACCESS_TOKEN}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: params,
        },
      );

      // 응답이 성공적이지 않은 경우 로그 남기고 종료
      if (!response.ok) {
        const text = await response.text();
        console.error(
          `[BAND API] 요청 실패 - 상태 코드: ${response.status}, 응답: ${text}`,
        );
        return;
      }

      // 글 작성 성공시 로그 남기기
      console.log(`[BAND API] '${event.title}' 글 작성 성공`);
    } catch (error) {
      // 예외 발생시 로그 남기고 재시도
      console.error("[BAND API] 요청 중 예외 발생:", error);
      console.log("재시도 중...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const response = await fetch(
        `https://openapi.band.us/v2.2/band/post/create?access_token=${process.env.NAVER_BAND_ACCESS_TOKEN}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: params,
        },
      );

      // 재시도 응답이 성공적이지 않은 경우 로그 남기고 종료
      if (!response.ok) {
        const text = await response.text();
        console.error(
          `[BAND API]  재시도 요청 실패 - 상태 코드: ${response.status}, 응답: ${text}`,
        );
        return;
      }
    }
  }
}
