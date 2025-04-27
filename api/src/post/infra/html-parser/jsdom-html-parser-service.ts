import { Injectable } from "@nestjs/common";
import { HtmlParserPort } from "src/post/application/port/html-parser.port";
import { JSDOM } from "jsdom";
@Injectable()
export class JSDOMHtmlParserService implements HtmlParserPort {
  extractFirstParagraphText(content: string): string {
    const { document } = new JSDOM(content).window;
    const paragraphs = document.querySelectorAll("p");
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const imgTag = paragraph.querySelector("img"); // p 태그 안에 img 태그가 있는지 확인

      // img 태그가 없으면 텍스트를 반환하고 종료
      if (!imgTag && paragraph.textContent) {
        return paragraph.textContent.trim(); // 텍스트 내용 반환 (앞뒤 공백 제거)
      }
    }
    return "";
  }
}
