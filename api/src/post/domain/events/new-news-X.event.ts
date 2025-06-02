export class NewNewsEventX {
  constructor(
    public readonly title: string,
    public readonly postId: number,
    public readonly media?: string,
  ) {}
}
