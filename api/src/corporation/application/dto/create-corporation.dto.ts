import { IsNumber, IsString } from "class-validator";

export class CreateCorporationDto {
  @IsString()
  koreanName: string;
  @IsString()
  englishName: string;
  @IsString()
  corporationType: string;
  @IsNumber()
  countryId: number;
}
