export interface CarouselResponse {
  message: string;
  data?: {
    id: number;
    image: string;
    postId: number;
    title: string;
    description: string;
  };
}
export interface CarouselArrayResponse {
  message: string;
  data: [
    {
      id: number;
      image: string;
      postId: number;
      title: string;
      description: string;
    },
  ];
}
