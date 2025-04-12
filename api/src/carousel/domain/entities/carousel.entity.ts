export class Carousel {
  constructor(
    public image: string,
    public postId: number,
    public koreanTitle: string,
    public koreanDescription: string,
    public englishTitle: string,
    public englishDescription: string,
    public japaneseTitle: string,
    public japaneseDescription: string,
    public id?: number,
  ) {}

  isImage() {
    return this.image === "carousel/123456-image.jpg";
  }
}
