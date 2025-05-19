import { Attachment } from "src/post/domain/entities/attachment.entity";
import { Post } from "src/post/domain/entities/post.entity";

export interface PostOKResponse {
  message: string;
}
export interface PostOneResponse {
  message: string;
  data: Post;
  files: Attachment[];
}
export interface PostImageUploadResponse {
  message: string;
  url: string;
}
export interface GetApplicantsResponse {
  message: string;
  applicants: {
    imageUrl: string;
    fileUrl: string;
  };
  entry: {
    imageUrl: string;
    fileUrl: string;
  };
}

export interface GetPaginationResponse {
  message: string;
  data: [
    {
      title: string;
      content: string;
      userId: number;
      category: string;
      language: string;
      createdDate: string;
      updatedDate: string;
      author: string;
      id: number;
    },
  ];
  currentPage: number;
  prevPage: number | null;
  nextPage: number | null;
  totalPage: number;
}

interface News {
  postId: number;
  imageUrl: string;
  title: string;
}
export interface GetNewsResponse {
  message: string;
  data: News[];
}

interface Notice {
  postId: number;
  title: string;
  date: string;
  content: string;
}
export interface GetNoticeResponse {
  message: string;
  data: Notice[];
}
