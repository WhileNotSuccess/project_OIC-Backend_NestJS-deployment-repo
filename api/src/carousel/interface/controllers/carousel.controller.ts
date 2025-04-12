import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { CreateCarouselDto } from "../../application/dto/create-carousel.dto";
import { UpdateCarouselDto } from "../../application/dto/update-carousel.dto";
import { CarouselService } from "../../application/services/carousel.service";
import { FileInterceptor } from "@nestjs/platform-express";

interface Req extends Request {
  cookies: { [key: string]: string };
}

@Controller("carousel")
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createdto: CreateCarouselDto,
  ) {
    if (!file) throw new BadRequestException("이미지 하나를 꼭 첨부해주세요.");
    await this.carouselService.create(createdto, file);
    return { message: "작성에 성공했습니다." };
  }

  @Get()
  async findAll(@Req() req: Req) {
    const language = req.cookies["language"] ?? "korean";
    const data = await this.carouselService.findAll(language);
    return { message: "carousel을 불러왔습니다.", data };
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: number,
    @Body() updatedto: UpdateCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.carouselService.update(id, updatedto, file);
    return { message: "수정에 성공했습니다." };
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.carouselService.delete(id);
    return { message: `삭제에 성공했습니다.` };
  }
}
