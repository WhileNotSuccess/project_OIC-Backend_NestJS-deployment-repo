import { IsObject } from "class-validator";

export class UpdateOrderDto {
  @IsObject()
  orders: Record<string, { id: number; order: number }[]>;
}
