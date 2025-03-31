import { IsString } from "class-validator";

export class CreateStaffDto {
  @IsString()
  name: string;
  @IsString()
  phoneNumber: string;
  @IsString()
  role: string;
}
