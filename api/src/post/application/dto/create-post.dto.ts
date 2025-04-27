import { IsEnum, IsString } from "class-validator";
import { Language } from "src/common/types/language";

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsEnum(Language)
  language: Language;
  @IsString()
  category: string;
}
