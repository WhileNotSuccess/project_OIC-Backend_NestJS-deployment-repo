export class Post {
  constructor(
    public title,
    public content,
    public author,
    public id?,
  ) {}
  isOwner(user: string) {
    return user === this.author;
  }
}
