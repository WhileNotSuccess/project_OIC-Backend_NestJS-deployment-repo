export class Attachment {
  constructor(
    public postId: number,
    public originalName: string,
    public url: string,
    public id?: number,
  ) {}
}
