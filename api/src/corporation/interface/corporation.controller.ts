import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from "@nestjs/common";
import { CorporationService } from "../application/corporation.service";
import { CreateCorporationDto } from "../application/dto/create-corporation.dto";
import { UpdateCorporationDto } from "../application/dto/update-corporation.dto";
import { CreateCountryDto } from "../application/dto/create-county.dto";
import { UpdateCountryDto } from "../application/dto/update-country.dto";
import { RequestWithCookies } from "src/common/request-with-cookies";
import { Language } from "src/common/types/language";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

@Controller("corporation")
export class CorporationController {
  constructor(private readonly corporationService: CorporationService) {}

  @ApiOperation({
    summary: "협약기관 생성",
  })
  @ApiBody({
    type: CreateCorporationDto,
  })
  @ApiResponse({
    example: {
      message: "생성이 완료되었습니다.",
    },
  })
  @Post("/corporation")
  async createCorporation(@Body() createCorporationDto: CreateCorporationDto) {
    await this.corporationService.createCorporation(createCorporationDto);
    return {
      message: "생성이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "협약기관 수정",
  })
  @ApiBody({
    type: CreateCorporationDto,
  })
  @ApiParam({
    name: "id",
    example: 1,
    description: "수정할 협약기관의 아이디",
  })
  @ApiResponse({
    example: {
      message: "수정이 완료되었습니다.",
    },
  })
  @Patch("/corporation/:id")
  async updateCorporation(
    @Param("id") id: string,
    @Body() updateCorporationDto: UpdateCorporationDto,
  ) {
    await this.corporationService.updateCorporation(+id, updateCorporationDto);
    return {
      message: "수정이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "협약기관 삭제",
  })
  @ApiParam({
    name: "id",
    example: 1,
    description: "삭제할 협약기관의 아이디",
  })
  @ApiResponse({
    example: {
      message: "삭제가 완료되었습니다.",
    },
  })
  @Delete("/corporation/:id")
  async removeCorporation(@Param("id") id: string) {
    await this.corporationService.deleteCorporation(+id);
    return {
      message: "삭제가 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "나라 생성",
  })
  @ApiBody({
    type: CreateCountryDto,
  })
  @ApiResponse({
    example: {
      message: "생성이 완료되었습니다.",
    },
  })
  @Post("/country")
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    await this.corporationService.createCountry(createCountryDto);
    return {
      message: "생성이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "나라 정보 수정",
  })
  @ApiBody({
    type: CreateCountryDto,
  })
  @ApiParam({
    name: "id",
    example: 1,
    description: "수정할 나라의 아이디",
  })
  @ApiResponse({
    example: {
      message: "수정이 완료되었습니다.",
    },
  })
  @Patch("/country/:id")
  async updateCountry(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    await this.corporationService.updateCountry(+id, updateCountryDto);
    return {
      message: "수정이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "협약기관 삭제",
  })
  @ApiParam({
    name: "id",
    example: 1,
    description: "삭제할 협약기관의 아이디",
  })
  @ApiResponse({
    example: {
      message: "삭제가 완료되었습니다.",
    },
  })
  @Delete("/country/:id")
  async removeCountry(@Param("id") id: string) {
    await this.corporationService.deleteCountry(+id);
    return {
      message: "삭제가 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "협약기관 목록 불러오기",
  })
  @ApiQuery({
    name: "country",
    example: "한국",
    description:
      "불러오고 싶은 나라 이름, 쿠키 상태에 따라 변화한다. 만약 language가 korean이면 한국, japanese면 韓国、english면 korea가 되는 식이다.",
  })
  @ApiResponse({
    example: {
      message: "한국 협약기관 목록을 불러왔습니다.",
      data: [{ id: 1, corporationType: "전문대학", name: "영진전문대학교" }],
    },
  })
  @Get()
  async findAllCorporationByCountry(
    @Query("country") country: string,
    @Req() req: RequestWithCookies,
  ) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);
    const result = await this.corporationService.getCorporationByCountry(
      language,
      country,
    );
    return {
      message: `${country} 협약기관 목록을 불러왔습니다.`,
      data: result,
    };
  }

  @ApiOperation({
    summary: "나라 목록 불러오기",
  })
  @ApiResponse({
    example: {
      message: "나라 목록을 불러왔습니다.",
      data: [{ id: 1, name: "한국", x: 100, y: 100 }],
    },
  })
  @Get("/countries")
  async findAllCountry(@Req() req: RequestWithCookies) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);
    const result = await this.corporationService.getAllCountry(language);
    return {
      message: "나라 목록을 불러왔습니다.",
      data: result,
    };
  }
}
