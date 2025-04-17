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
}

export interface ReturnCarousel {
  image: string;
  postId: number;
  title: string;
  description: string;
  id: number;
}
