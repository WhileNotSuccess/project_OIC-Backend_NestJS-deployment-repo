import { IsNumber, IsString } from "class-validator";

export class CreateCountryDto {
  @IsString()
  name: string;
  @IsString()
  englishName: string;
  @IsString()
  japaneseName: string;
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}
