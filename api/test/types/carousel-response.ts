export interface CarouselResponse {
  message: string;
  data?: {
    id: number;
    image: string;
    postId: number;
    KoreanTitle: string;
    EnglishTitle: string;
    JapaneseTitle: string;
    KoreanDescription: string;
    EnglishDescription: string;
    JapaneseDescription: string;
  };
}
export interface CarouselArrayResponse {
  message: string;
  data: [
    {
      id: number;
      image: string;
      postId: number;
      KoreanTitle: string;
      EnglishTitle: string;
      JapaneseTitle: string;
      KoreanDescription: string;
      EnglishDescription: string;
      JapaneseDescription: string;
    },
  ];
}
