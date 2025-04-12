import { IsString } from "class-validator";

export class CreatePrideOfYjuDto {
  @IsString()
  Korean: string;
  @IsString()
  English: string;
  @IsString()
  Japanese: string;
}
