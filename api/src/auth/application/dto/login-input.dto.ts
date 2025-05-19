import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginInput {
  @ApiProperty({
    description: "이메일",
    example: "hello@gmail.com",
  })
  @IsString()
  email: string;
  @ApiProperty({
    description: "비밀번호",
    example: "password123",
  })
  @IsString()
  password: string;
}
