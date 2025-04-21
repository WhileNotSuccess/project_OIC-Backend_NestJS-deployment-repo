import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCorporationDto {
  @ApiProperty({
    name: "koreanName",
    description: "기관의 한국어 이름",
  })
  @IsString()
  koreanName: string;
  @ApiProperty({
    name: "englishName",
    description: "기관의 영어 이름",
  })
  @IsString()
  englishName: string;
  @ApiProperty({
    name: "corporationType",
    description: "기관의 종류",
  })
  @IsString()
  corporationType: string;
  @ApiProperty({
    name: "countryId",
    description: "기관이 속한 국가의 아이디",
  })
  @IsNumber()
  countryId: number;
}
