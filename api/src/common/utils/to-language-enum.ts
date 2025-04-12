import { Language } from "src/post/domain/types/language";

export function toLanguageEnum(value: string): Language {
  const values = Object.values(Language);
  return values.includes(value as Language)
    ? (value as Language)
    : Language.korean;
}
