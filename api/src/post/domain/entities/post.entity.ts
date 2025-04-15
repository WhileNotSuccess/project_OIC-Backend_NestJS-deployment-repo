import { Language } from "../../../common/types/language";

export class Post {
  constructor(
    public title: string,
    public content: string,
    public userId: number,
    public category: string,
    public language: Language,
    public createdDate: Date,
    public updatedDate: Date,
    public id?: number,
  ) {}
  isOwner(userId: number) {
    return userId === this.userId;
  }
}
