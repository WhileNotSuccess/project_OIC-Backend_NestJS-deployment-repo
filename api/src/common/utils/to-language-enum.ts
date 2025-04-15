import { Language } from "src/common/types/language";

export function toLanguageEnum(value: string): Language {
  const values = Object.values(Language);
  return values.includes(value as Language)
    ? (value as Language)
    : Language.korean;
}
