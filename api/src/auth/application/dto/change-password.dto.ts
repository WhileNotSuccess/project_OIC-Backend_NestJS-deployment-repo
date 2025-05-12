import { IsString } from "class-validator";

export class changePWDto {
  @IsString()
  exPassword: string;
  @IsString()
  newPassword: string;
}
