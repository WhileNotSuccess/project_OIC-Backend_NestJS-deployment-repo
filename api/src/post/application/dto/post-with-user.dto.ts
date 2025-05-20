import { Language } from "src/common/types/language";

export class PostWithUserDto {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public userId: number,
    public category: string,
    public language: Language,
    public createdDate: Date,
    public updatedDate: Date,
    public user: {
      name: string;
      email: string;
    },
  ) {}
}

export type PostWithAuthor = {
  id: number;
  title: string;
  content: string;
  userId: number;
  category: string;
  language: string;
  createdDate: Date;
  updatedDate: Date;
  author: string;
};
