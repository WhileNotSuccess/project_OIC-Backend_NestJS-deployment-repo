import { NewNewsEventX } from "src/post/domain/events/new-news-X.event";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import * as fs from "fs";
import { lookup } from "mime-types";

// import { Controller, Get, Post } from "@nestjs/common";
// import * as crypto from "crypto";
import { ApiResponseError, TwitterApi } from "twitter-api-v2";

@EventsHandler(NewNewsEventX)
export class CreatePostForNewNewsListenerX
  implements IEventHandler<NewNewsEventX>
{
  async handle(event: NewNewsEventX) {
    // const event: NewNewsEventX = {
    //   title: "hello",
    //   postId: 12345321,
    //   media: "../files/1234.png",
    // };
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
      `${process.env.FRONTEND_URL}/news/${event.postId}`,
    ].join("\n\n");

    try {
      let mediaId: string | undefined;
      if (event.media) {
        const mediaPath = `../${event.media}`;

        if (!fs.existsSync(mediaPath)) {
          console.warn("해당 미디어 파일이 존재하지 않습니다.", mediaPath);
        } else {
          const media = fs.readFileSync(`../${event.media}`);
          const mimeType = lookup(mediaPath) || "application/octet-stream";

          mediaId = await client.v1.uploadMedia(media, {
            mimeType,
          });
        }
      }

      // // 영상, 사진 등 미디어가 있을 경우 업로드 해서 id 받아오기
      // const mediaId = event.media
      //   ? await client.v1.uploadMedia(fs.readFileSync(`../${event.media}`), {
      //       mimeType: lookup(event.media),
      //     })
      //   : undefined;

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

// @Controller("llo")
// export class CreatePostForNewNewsListenerX {
//   @Get()
//   async handle() {
//     // text: string
//     try {
//       const postId = "1898262632538271901";
//       const response = await fetch(
//         `https://api.twitter.com/2/tweets/${postId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
//             // "Content-Type": "application/json",
//           },
//         },
//       );
//       console.log(response.body);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   @Post()
//   async postTweet() {
//     const url = "https://api.twitter.com/2/tweets";
//     const method = "POST";
//     const text = "Hello nice to meet you, \n this account is yeongjin OIC";

//     const oauthParams: Record<string, string> = {
//       oauth_consumer_key: process.env.X_API_KEY!,
//       oauth_nonce: crypto.randomBytes(16).toString("hex"),
//       oauth_signature_method: "HMAC-SHA1",
//       oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
//       oauth_token: process.env.X_ACCESS_TOKEN!,
//       oauth_version: "1.0",
//     };

//     // 1. 시그니처 생성
//     const signature = this.generateSignature(oauthParams, method, url);
//     oauthParams.oauth_signature = signature;

//     // 2. OAuth 헤더 문자열 구성
//     const authHeader = this.buildOAuthHeader(oauthParams);

//     // 3. 요청 전송
//     const response = await fetch(url, {
//       method,
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text }),
//     });

//     const data = await response.json();
//     console.log("응답 상태:", response.status);
//     console.log("응답 본문:", data);

//     return {
//       status: response.status,
//       body: data,
//     };
//   }

//   private generateSignature(
//     params: Record<string, string>,
//     method: string,
//     baseUrl: string,
//   ): string {
//     const sorted = Object.keys(params)
//       .sort()
//       .map(
//         (key) =>
//           `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
//       )
//       .join("&");

//     const signatureBase = [
//       method.toUpperCase(),
//       encodeURIComponent(baseUrl),
//       encodeURIComponent(sorted),
//     ].join("&");

//     const signingKey = `${encodeURIComponent(process.env.X_API_KEY_SECRET!)}&${encodeURIComponent(
//       process.env.X_ACCESS_TOKEN_SECRET!,
//     )}`;

//     return crypto
//       .createHmac("sha1", signingKey)
//       .update(signatureBase)
//       .digest("base64");
//   }

//   private buildOAuthHeader(params: Record<string, string>): string {
//     const header = Object.entries(params)
//       .map(
//         ([key, val]) =>
//           `${encodeURIComponent(key)}="${encodeURIComponent(val)}"`,
//       )
//       .join(", ");

//     return `OAuth ${header}`;
//   }

//   @Post('1')
//   async tweet() {
//     const client = new TwitterApi({
//       appKey: process.env.X_API_KEY!,
//       appSecret: process.env.X_API_KEY_SECRET!,
//       accessToken: process.env.X_ACCESS_TOKEN!,
//       accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
//     });
//     try {
//       const result = await client.v2.tweet("Hello from OAuth 1.0a!");
//       console.log("성공!", result);
//     } catch (e) {
//       console.error("실패:", e);
//     }
//   }
// }
