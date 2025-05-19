import { IsString } from "class-validator";
import { LoginInput } from "./login-input.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterInput extends LoginInput {
  @ApiProperty({
    description: "이름",
    example: "아무개",
  })
  @IsString()
  name: string;
}
