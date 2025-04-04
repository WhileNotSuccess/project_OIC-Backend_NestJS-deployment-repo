import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateCarouselDto } from "src/carousel/application/dto/create-carousel.dto";
import { UpdateCarouselDto } from "src/carousel/application/dto/update-carousel.dto";
import { CarouselService } from "src/carousel/application/services/carousel.service";

@Controller("carousel")
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  async create(@Body() createdto: CreateCarouselDto) {
    await this.carouselService.create(createdto);
    return { message: "작성에 성공했습니다." };
  }

  @Get()
  async findAll() {
    await this.carouselService.findAll();
    return { message: "carousel을 불러왔습니다." };
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() updatedto: UpdateCarouselDto) {
    await this.carouselService.update(id, updatedto);
    return { message: "수정에 성공했습니다." };
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.carouselService.delete(id);
    return { message: "삭제에 성공했습니다." };
  }
}
