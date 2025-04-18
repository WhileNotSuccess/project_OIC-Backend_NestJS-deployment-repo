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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { ReturnCarousel } from "src/carousel/domain/entities/carousel.entity";
import { Language } from "src/common/types/language";

interface Req extends Request {
  cookies: { [key: string]: string };
}

@Controller("carousel")
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @ApiOperation({ summary: "carousel 작성, 하나의 이미지 파일 필수" })
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
        postId: { type: "number", description: "이동할 글 ID" },
        koreanTitle: { type: "string", description: "한국어 글" },
        koreanDescription: { type: "string", description: "한국어 설명" },
        englishTitle: { type: "string", description: "영어 글" },
        englishDescription: { type: "string", description: "영어 설명" },
        japaneseTitle: { type: "string", description: "일본어 글" },
        japaneseDescription: { type: "string", description: "일본어 설명" },
      },
    },
  })
  @ApiResponse({ example: { message: "carousel 작성에 성공했습니다." } })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateCarouselDto,
  ) {
    // 이미지 없을 경우 400
    if (!file) throw new BadRequestException("이미지 하나를 꼭 첨부해주세요.");
    // 저장
    await this.carouselService.create(createDto, file);
    return { message: `carousel 작성에 성공했습니다.` };
  }

  @ApiOperation({ summary: "carousel를 가공없이 불러오기" })
  @ApiResponse({
    example: {
      message: "carousel을 열을 가공없이 불러왔습니다.",
      data: [
        {
          id: 1,
          image: "/carousel/141735.png",
          postId: 1,
          koreanTitle: "한국어 글",
          koreanDescription: "한국어 설명",
          englishTitle: "영어 글",
          englishDescription: "영어 설명",
          japaneseTitle: "일본어 글",
          japaneseDescription: "일본어 설명",
        },
      ],
    },
  })
  @Get("raw")
  async getRawAll() {
    const data = await this.carouselService.getRawAll();
    return { message: "carousel 열을 가공없이 불러왔습니다.", data };
  }

  @ApiOperation({ summary: "carousel 하나를 불러오기" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({
    example: {
      message: "1번 carousel을 불러왔습니다.",
      data: {
        id: 1,
        image: "/carousel/141735.png",
        postId: 1,
        koreanTitle: "한국어 글",
        koreanDescription: "한국어 설명",
        englishTitle: "영어 글",
        englishDescription: "영어 설명",
        japaneseTitle: "일본어 글",
        japaneseDescription: "일본어 설명",
      },
    },
  })
  @Get(":id")
  async getOne(@Param("id") id: number) {
    const data = await this.carouselService.getOne(id);
    return { message: `${id}번 carousel을 불러왔습니다.`, data };
  }

  @ApiOperation({ summary: "carousel을 가공하여 불러오기" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({
    example: {
      message: "1번 carousel을 불러왔습니다.",
      data: [
        {
          id: 1,
          image: "/carousel/141735.png",
          postId: 1,
          title: "한국어 글",
          description: "한국어 설명",
        },
      ],
    },
  })
  @Get()
  async findAll(@Req() req: Req) {
    const language = (req.cookies["language"] as Language) ?? Language.korean;
    const data: ReturnCarousel[] = await this.carouselService.findAll(language);
    return { message: "carousel을 불러왔습니다.", data };
  }

  @ApiOperation({ summary: "carousel을 수정하기" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "이미지 파일, 필수 아님",
        },
        postId: { type: "number", description: "이동할 글 ID, 필수 아님" },
        koreanTitle: { type: "string", description: "한국어 글, 필수 아님" },
        koreanDescription: {
          type: "string",
          description: "한국어 설명, 필수 아님",
        },
        englishTitle: { type: "string", description: "영어 글, 필수 아님" },
        englishDescription: {
          type: "string",
          description: "영어 설명, 필수 아님",
        },
        japaneseTitle: { type: "string", description: "일본어 글, 필수 아님" },
        japaneseDescription: {
          type: "string",
          description: "일본어 설명, 필수 아님",
        },
      },
    },
  })
  @ApiResponse({
    example: {
      message: "carousel 수정에 성공했습니다.",
    },
  })
  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdateCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.carouselService.update(id, updateDto, file);
    return { message: "carousel 수정에 성공했습니다." };
  }

  @ApiOperation({ summary: "carousel을 삭제하기" })
  @ApiParam({ name: "id", example: 1 })
  @ApiResponse({
    example: {
      message: "carousel 삭제에 성공했습니다.",
    },
  })
  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.carouselService.delete(id);
    return { message: `carousel 삭제에 성공했습니다.` };
  }
}
