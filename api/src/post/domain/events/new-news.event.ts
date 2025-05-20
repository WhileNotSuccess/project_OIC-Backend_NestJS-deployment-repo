export class NewNewsEvent {
  constructor(
    public readonly title: string,
    public readonly postId: number,
  ) {}
}
