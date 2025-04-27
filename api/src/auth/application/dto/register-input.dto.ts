import { IsString } from "class-validator";
import { LoginInput } from "./login-input.dto";

export class RegisterInput extends LoginInput {
  @IsString()
  name: string;
}
