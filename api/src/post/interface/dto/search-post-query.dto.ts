import { IsEnum, IsString } from "class-validator";
import { SearchTarget } from "src/post/domain/types/search-target.enum";

export class SearchPostQueryDto {
  @IsEnum(SearchTarget)
  target: SearchTarget;
  @IsString()
  word: string;
}
