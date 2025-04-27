import { JSDOMHtmlParserService } from "./jsdom-html-parser-service";

describe("JSDOMHtmlParserService", () => {
  let jSDOMHtmlParserService: JSDOMHtmlParserService;

  beforeEach(() => {
    jSDOMHtmlParserService = new JSDOMHtmlParserService();
  });

  it("should extract text from the first <p> tag that contains text", () => {
    const testHtml = `
      <p><img src="http://localhost:3000/files/post/image.png" alt="" width="190" height="162"></p>
      <p>감사해요</p>
      <p>잘있어요</p>
      <p>다시만나요</p>
    `;
    const preview = jSDOMHtmlParserService.extractFirstParagraphText(testHtml);
    expect(preview).toBe("감사해요");
  });

  it("should return empty string if there are no <p> tags", () => {
    const testHtml = `
      <div>Hello World</div>
      <span>Goodbye</span>
    `;
    const preview = jSDOMHtmlParserService.extractFirstParagraphText(testHtml);
    expect(preview).toBe("");
  });

  it("should return empty string if the first <p> contains only an image and no text", () => {
    const testHtml = `
      <p><img src="http://localhost:3000/files/post/image.png" alt="" width="190" height="162"></p>
      <p><img src="http://localhost:3000/files/post/image2.png" alt="" width="190" height="162"></p>
    `;
    const preview = jSDOMHtmlParserService.extractFirstParagraphText(testHtml);
    expect(preview).toBe("");
  });
});
