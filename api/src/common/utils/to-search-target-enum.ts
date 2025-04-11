import { searchTarget } from "src/post/domain/types/searchTarget";

export function toSearchTargetEnum(value: string): searchTarget {
  const values = Object.values(searchTarget);
  return values.includes(value as searchTarget)
    ? (value as searchTarget)
    : searchTarget.title;
}
