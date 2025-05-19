import { Language } from "src/common/types/language";

export class PostWithAuthorDto {
  constructor(
    public title: string,
    public content: string,
    public author: string,
    public userId: number,
    public category: string,
    public language: Language,
    public createdDate: Date,
    public updatedDate: Date,
    public id?: number,
  ) {}
}
