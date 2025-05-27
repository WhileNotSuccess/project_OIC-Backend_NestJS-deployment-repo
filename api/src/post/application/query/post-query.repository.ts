import { Language } from "src/common/types/language";
import { SearchTarget } from "src/post/domain/types/search-target.enum";
import { PostWithAuthor } from "../dto/post-with-user.dto";

export abstract class PostQueryRepository {
  abstract getOneWithAuthorById(postId: number): Promise<PostWithAuthor | null>;

  abstract getManyWithAuthorByCategory(
    category: string,
    page: number,
    take: number,
    language: Language,
  ): Promise<[PostWithAuthor[], number]>;

  abstract getManyWithAuthorByCategoryWithoutLanguage(
    category: string,
    page: number,
    take: number,
  ): Promise<[PostWithAuthor[], number]>;

  abstract search(
    target: SearchTarget,
    word: string,
    language: Language,
    category: string,
    page: number,
    limit: number,
  ): Promise<[PostWithAuthor[], number]>;
}
