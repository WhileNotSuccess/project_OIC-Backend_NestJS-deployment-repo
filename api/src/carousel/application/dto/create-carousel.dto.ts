import { IsNumber, IsString } from "class-validator";

export class CreateCarouselDto {
  @IsNumber()
  postId: number;
  @IsString()
  koreanTitle: string;
  @IsString()
  koreanDescription: string;
  @IsString()
  englishTitle: string;
  @IsString()
  englishDescription: string;
  @IsString()
  japaneseTitle: string;
  @IsString()
  japaneseDescription: string;
}
