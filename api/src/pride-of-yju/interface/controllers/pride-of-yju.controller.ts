import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreatePrideOfYjuDto } from "src/pride-of-yju/application/dto/create-pride-of-yju.dto";
import { UpdatePrideOfYjuDto } from "src/pride-of-yju/application/dto/update-pride-of-yju.dto";
import { PrideOfYjuService } from "src/pride-of-yju/application/services/pride-of-yju.service";

@Controller("pride")
export class PrideOfYjuController {
  constructor(private readonly POYservice: PrideOfYjuService) {}

  @Post()
  async create(@Body() dto: CreatePrideOfYjuDto) {
    await this.POYservice.create("", dto);
    return { message: "작성에 성공했습니다." };
  }
  @Patch(":id")
  async update(@Param("id") id: number, @Body() dto: UpdatePrideOfYjuDto) {
    await this.POYservice.update(id, "", dto);
    return { message: "수정에 성공했습니다." };
  }
  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.POYservice.delete(id);
    return { message: "삭제에 성공했습니다." };
  }
  @Get(":id")
  async getOne(@Param("id") id: number) {
    const result = await this.POYservice.getOne(id);
    return { message: "pride of yju를 불러왔습니다.", data: result };
  }
  @Get()
  async getAll() {
    const result = await this.POYservice.getAll();
    return { message: "pride of yju를 불러왔습니다.", data: result };
  }
}
