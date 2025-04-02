export interface Post {
  title: string;
  content: string;
  author: string;
}
export interface PostOKResponse {
  message: string;
}
export interface PostArrayResponse {
  message: string;
  data: Post[];
}
export interface PostOneResponse {
  message: string;
  data: Post;
}
