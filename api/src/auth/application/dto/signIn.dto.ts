import { IsString } from "class-validator";

export class SignInDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
