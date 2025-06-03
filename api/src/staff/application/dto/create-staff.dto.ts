import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStaffDto {
  @ApiProperty({
    name: "name",
    description: "이름",
  })
  @IsString()
  name: string;
  @ApiProperty({
    name: "position",
    description: "직위",
  })
  @IsString()
  position: string;
  @ApiProperty({
    name: "phone",
    description: "phone",
  })
  @IsString()
  phone: string;
  @ApiProperty({
    name: "email",
    description: "email",
  })
  @IsString()
  email: string;
  @ApiProperty({
    name: "team",
    description: "소속",
  })
  @IsString()
  team: string;
  @ApiProperty({
    name: "position_jp",
    description: "직위 일본어 이름",
  })
  @IsString()
  position_jp: string;
  @ApiProperty({
    name: "team_jp",
    description: "소속 일본어 이름",
  })
  @IsString()
  team_jp: string;
  @ApiProperty({
    name: "position_en",
    description: "직위 영어 이름",
  })
  @IsString()
  position_en: string;
  @ApiProperty({
    name: "team_en",
    description: "소속 영어 이름",
  })
  @IsString()
  team_en: string;
  @ApiProperty({
    name: "role",
    description: "담당 업무, 필수 아님",
  })
  @IsString()
  @IsOptional()
  role?: string;
  @ApiProperty({
    name: "role_en",
    description: "담당 업무, 필수 아님, 영어",
  })
  @IsString()
  @IsOptional()
  role_en?: string;
  @ApiProperty({
    name: "role_jp",
    description: "담당 업무, 필수 아님, 일본어",
  })
  @IsString()
  @IsOptional()
  role_jp?: string;
  @ApiProperty({
    name: "order",
    description: "정렬 순서",
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
