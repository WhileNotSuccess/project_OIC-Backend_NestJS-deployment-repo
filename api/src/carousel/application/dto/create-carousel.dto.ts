import { IsNumber, IsString } from "class-validator";

export class CreateCarouselDto {
  @IsNumber()
  postId: number;
  @IsString()
  KoreanTitle: string;
  @IsString()
  KoreanDescription: string;
  @IsString()
  EnglishTitle: string;
  @IsString()
  EnglishDescription: string;
  @IsString()
  JapaneseTitle: string;
  @IsString()
  JapaneseDescription: string;
}
