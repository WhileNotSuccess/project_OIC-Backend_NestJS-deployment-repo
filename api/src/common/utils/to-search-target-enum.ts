import { SearchTarget } from "src/post/domain/types/search-target.enum";

export function toSearchTargetEnum(value: string): SearchTarget {
  const values = Object.values(SearchTarget);
  return values.includes(value as SearchTarget)
    ? (value as SearchTarget)
    : SearchTarget.title;
}
