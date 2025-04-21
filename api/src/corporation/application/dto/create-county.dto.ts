import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCountryDto {
  @ApiProperty({
    name: "name",
    description: "나라의 한국어 이름",
  })
  @IsString()
  name: string;
  @ApiProperty({
    name: "englishName",
    description: "나라의 영어 이름",
  })
  @IsString()
  englishName: string;
  @ApiProperty({
    name: "japaneseName",
    description: "나라의 일본어 이름",
  })
  @IsString()
  japaneseName: string;
  @ApiProperty({
    name: "x",
    description: "지도에서의 x 좌표",
  })
  @IsNumber()
  x: number;
  @ApiProperty({
    name: "y",
    description: "지도에서의 y 좌표",
  })
  @IsNumber()
  y: number;
}
