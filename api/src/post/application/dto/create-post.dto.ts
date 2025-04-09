import { IsString } from "class-validator";
import { Language } from "src/post/domain/types/language";

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  language: Language;
  @IsString()
  category: string;
}
