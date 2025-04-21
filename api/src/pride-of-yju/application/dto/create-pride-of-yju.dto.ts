import { IsString } from "class-validator";

export class CreatePrideOfYjuDto {
  @IsString()
  korean: string;
  @IsString()
  english: string;
  @IsString()
  japanese: string;
}
