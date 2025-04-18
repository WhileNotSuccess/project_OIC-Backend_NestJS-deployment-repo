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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { CreatePrideOfYjuDto } from "src/pride-of-yju/application/dto/create-pride-of-yju.dto";
import { UpdatePrideOfYjuDto } from "src/pride-of-yju/application/dto/update-pride-of-yju.dto";
import { PrideOfYjuService } from "src/pride-of-yju/application/services/pride-of-yju.service";

@Controller("pride")
export class PrideOfYjuController {
  constructor(private readonly POYservice: PrideOfYjuService) {}

  @ApiOperation({ summary: "PrideOfYju 작성, 하나의 이미지 파일 필수" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "이미지 파일, 필수",
        },
        Korean: { type: "string", description: "한국어 설명, 필수" },
        English: { type: "string", description: "영어 설명, 필수" },
        Japanese: { type: "string", description: "일본어 설명, 필수" },
      },
    },
  })
  @ApiResponse({
    example: {
      message: "PridOfYju 작성에 성공했습니다.",
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body() dto: CreatePrideOfYjuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.POYservice.create(file, dto);
    return { message: "PridOfYju 작성에 성공했습니다." };
  }

  @ApiOperation({ summary: "PrideOfYju 수정 요청, 이미지 수정시 첨부할 것" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "이미지 파일, 수정하지 않을 경우 필수 아님",
        },
        Korean: { type: "string", description: "글의 카테고리, 필수 아님" },
        English: { type: "string", description: "글의 제목, 필수 아님" },
        Japanese: { type: "string", description: "글의 내용, 필수 아님" },
      },
    },
  })
  @ApiResponse({ example: { message: "PridOfYju 수정에 성공했습니다." } })
  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: number,
    @Body() dto: UpdatePrideOfYjuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.POYservice.update(id, file, dto);
    return { message: "PridOfYju 수정에 성공했습니다." };
  }

  @ApiOperation({ summary: "PrideOfYju 삭제 요청" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({ example: { message: "PridOfYju 삭제에 성공했습니다." } })
  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.POYservice.delete(id);
    return { message: "PridOfYju 삭제에 성공했습니다." };
  }

  @ApiOperation({ summary: "1개의 PrideOfYju를 불러오기" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({
    example: {
      message: "pride of yju를 불러왔습니다.",
      data: {
        id: 1,
        image: "/carousel/141735.png",
        Korean: "한글 설명",
        English: "영어 설명",
        Japanese: "일본어 설명",
      },
    },
  })
  @Get(":id")
  async getOne(@Param("id") id: number) {
    const result = await this.POYservice.getOne(id);
    return { message: "pride of yju를 불러왔습니다.", data: result };
  }
  @ApiOperation({ summary: "모든 PrideOfyju를 불러오기" })
  @ApiResponse({
    example: {
      message: "pride of yju를 불러왔습니다.",
      data: [
        {
          id: 1,
          image: "/carousel/141735.png",
          Korean: "한글 설명",
          English: "영어 설명",
          Japanese: "일본어 설명",
        },
      ],
    },
  })
  @Get()
  async getAll() {
    const result = await this.POYservice.getAll();
    return { message: "pride of yju를 불러왔습니다.", data: result };
  }
}
