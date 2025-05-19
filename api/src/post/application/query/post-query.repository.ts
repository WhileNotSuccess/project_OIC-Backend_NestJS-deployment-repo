import { Language } from "src/common/types/language";
import { PostWithAuthorDto } from "../dto/post-with-author.dto";
import { SearchTarget } from "src/post/domain/types/search-target.enum";

export abstract class PostQueryRepository {
  abstract getOneWithAuthorById(
    postId: number,
  ): Promise<PostWithAuthorDto | null>;

  abstract getManyWithAuthorByCategory(
    category: string,
    page: number,
    take: number,
    language: Language,
  ): Promise<[PostWithAuthorDto[], number]>;

  abstract search(
    target: SearchTarget,
    word: string,
    language: Language,
    category: string,
    page: number,
    limit: number,
  ): Promise<[PostWithAuthorDto[], number]>;
}
