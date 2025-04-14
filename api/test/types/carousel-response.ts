interface impressedCarousel {
  id: number;
  image: string;
  postId: number;
  title: string;
  description: string;
}
interface Carousel {
  id: number;
  image: string;
  postId: number;
  koreanTitle: string;
  koreanDescription: string;
  englishTitle: string;
  englishDescription: string;
  japaneseTitle: string;
  japaneseDescription: string;
}
export interface CarouselOKResponse {
  message: string;
}
export interface CarouselResponse {
  message: string;
  data: Carousel;
}
export interface CarouselArrayResponse {
  message: string;
  data: impressedCarousel[];
}
