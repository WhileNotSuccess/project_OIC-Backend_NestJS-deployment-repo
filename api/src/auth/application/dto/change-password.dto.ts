import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class changePWDto {
  @ApiProperty({
    description: "현재 비밀번호",
    example: "password123",
  })
  @IsString()
  exPassword: string;
  @ApiProperty({
    description: "새 비밀번호",
    example: "newpassword123",
  })
  @IsString()
  newPassword: string;
}
