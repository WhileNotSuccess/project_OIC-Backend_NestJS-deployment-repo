import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreatePrideOfYjuDto } from "src/pride-of-yju/application/dto/create-pride-of-yju.dto";
import { UpdatePrideOfYjuDto } from "src/pride-of-yju/application/dto/update-pride-of-yju.dto";
import { PrideOfYjuService } from "src/pride-of-yju/application/services/pride-of-yju.service";

@Controller("pride")
export class PrideOfYjuController {
  constructor(private readonly POYservice: PrideOfYjuService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body() dto: CreatePrideOfYjuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.POYservice.create(file, dto);
    return { message: "작성에 성공했습니다." };
  }
  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: number,
    @Body() dto: UpdatePrideOfYjuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.POYservice.update(id, file, dto);
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
