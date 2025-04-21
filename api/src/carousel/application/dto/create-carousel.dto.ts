import { IsNumber, IsString } from "class-validator";

export class CreateCarouselDto {
  @IsNumber()
  koreaPostId: number;
  @IsNumber()
  englishPostId: number;
  @IsNumber()
  japanesePostId: number;
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
