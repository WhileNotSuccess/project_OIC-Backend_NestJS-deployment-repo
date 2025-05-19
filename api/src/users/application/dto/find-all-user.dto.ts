import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { FindAllUsersOptions as FindAllUsersOptionsBase } from "../../domain/repositories/user.repository";
export class FindAllUsersOptions implements FindAllUsersOptionsBase {
  @ApiProperty({
    example: 1,
    description: "페이지 번호",
    required: true,
  })
  @IsNumber()
  page: number;
  @ApiProperty({
    example: 20,
    description: "페이지당 유저 수",
    required: true,
  })
  @IsNumber()
  limit: number;
  @ApiProperty({
    example: "이름",
    description: "검색할 키워드",
    required: false,
  })
  @IsString()
  keyword?: string;
  @ApiProperty({
    example: "name",
    description: "정렬할 열",
    required: true,
  })
  @IsString()
  sortBy: "name" | "email" | "createdDate";
  @ApiProperty({
    example: "ASC",
    description: "정렬 방식",
    required: true,
  })
  @IsString()
  order: "ASC" | "DESC";
}
