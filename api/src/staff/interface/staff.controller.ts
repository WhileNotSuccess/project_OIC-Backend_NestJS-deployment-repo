import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { StaffService } from "../application/service/staff.service";
import { CreateStaffDto } from "../application/dto/create-staff.dto";
import { UpdateStaffDto } from "../application/dto/update-staff.dto";
import { RequestWithCookies } from "src/common/request-with-cookies";
import { toLanguageEnum } from "src/common/utils/to-language-enum";
import { Language } from "src/common/types/language";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({
    summary: "staff 생성",
  })
  @ApiBody({
    type: CreateStaffDto,
  })
  @ApiResponse({
    example: {
      message: "생성이 완료되었습니다.",
    },
  })
  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    await this.staffService.create(createStaffDto);
    return {
      message: "생성이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "모든 staff를 언어설정에 맞게 가져옵니다.",
  })
  @ApiResponse({
    example: {
      message: "직원 목록을 불러왔습니다",
      data: {
        team1: [
          {
            name: "name",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team1",
            role: "role",
            id: 1,
          },
        ],
        team2: [
          {
            name: "name",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team2",
            role: "role",
            id: 2,
          },
        ],
      },
    },
  })
  @Get()
  async findAll(@Req() req: RequestWithCookies) {
    const rawLang = req.cookies["language"] || "korean";
    const language: Language = toLanguageEnum(rawLang);
    return {
      message: "직원 목록을 불러왔습니다",
      data: await this.staffService.findAll(language),
    };
  }

  @ApiOperation({
    summary: "모든 staff를 모든 언어와 함께 가져옵니다.",
  })
  @ApiResponse({
    example: {
      message: "직원 목록을 불러왔습니다",
      data: {
        team1: [
          {
            name: "name",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team1",
            role: "role",
            position_en: "position_en",
            team_en: "team1",
            role_en: "role",
            position_jp: "position_en",
            team_jp: "team1",
            role_jp: "role",
            id: 1,
          },
        ],
        team2: [
          {
            name: "name",
            phone: "phone",
            email: "email",
            position: "position_en",
            team: "team2",
            role: "role",
            position_en: "position_en",
            team_en: "team1",
            role_en: "role",
            position_jp: "position_en",
            team_jp: "team1",
            role_jp: "role",
            id: 2,
          },
        ],
      },
    },
  })
  @Get("/admin")
  async findAllForAdmin() {
    return {
      message: "직원 목록을 불러왔습니다",
      data: await this.staffService.findAllWithoutLanguage(),
    };
  }

  @ApiOperation({
    summary: "staff 수정",
  })
  @ApiParam({
    name: "id",
    description: "수정하고자 하는 staff의 아이디",
    example: 1,
  })
  @ApiBody({
    type: CreateStaffDto,
  })
  @ApiResponse({
    example: {
      message: "수정이 완료되었습니다.",
    },
  })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    await this.staffService.update(+id, updateStaffDto);
    return {
      message: "수정이 완료되었습니다.",
    };
  }

  @ApiOperation({
    summary: "staff 삭제",
  })
  @ApiParam({
    name: "id",
    description: "삭제하고자 하는 staff의 아이디",
    example: 1,
  })
  @ApiResponse({
    example: {
      message: "삭제가 완료되었습니다.",
    },
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.staffService.remove(+id);
    return {
      message: "삭제가 완료되었습니다.",
    };
  }
}
