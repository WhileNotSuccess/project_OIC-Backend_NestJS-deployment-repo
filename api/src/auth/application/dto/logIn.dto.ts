import { IsString } from "class-validator";

export class logInDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
