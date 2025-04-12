export class PostImage {
  constructor(
    public postId: number,
    public filename: string,
    public fileSize: number,
    public id?: number,
  ) {}
}
