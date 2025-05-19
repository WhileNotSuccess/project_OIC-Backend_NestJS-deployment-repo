import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CustomRequest } from "src/common/types/custom-request";
import { AdminGuard } from "src/shared/guards/admin.guard";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { FindAllUsersOptions } from "src/users/application/dto/find-all-user.dto";
import { NameChangeInput } from "src/users/application/dto/name-change.dto";
import { ChangeUserName } from "src/users/application/use-cases/change-user-name-use-case";
import { GetAllUsersUseCase } from "src/users/application/use-cases/get-all-users.use-case";
import { GetUserInfo } from "src/users/application/use-cases/get-user-info.use-case";

@Controller("users")
export class UsersController {
  constructor(
    private readonly getAllUser: GetAllUsersUseCase,
    private readonly getUserInfo: GetUserInfo,
    private readonly changeUserName: ChangeUserName,
  ) {}

  // 유저의 이름 변경
  @ApiOperation({ summary: "유저 이름 변경" })
  @ApiBody({ type: NameChangeInput })
  @ApiResponse({
    example: {
      message: "이름이 수정되었습니다.",
    },
  })
  @UseGuards(AuthGuard)
  @Patch()
  async nameChange(@Req() req: CustomRequest, @Body() body: NameChangeInput) {
    const user = req.user;
    const updatedUser = await this.changeUserName.execute(user.id, body.name);
    return { message: "이름이 수정되었습니다.", userInfo: updatedUser };
  }
  // 유저가 관리자인지 확인
  @ApiOperation({ summary: "유저가 관리자인지 확인" })
  @ApiResponse({
    example: {
      message: "관리자 확인 결과 입니다.",
      result: true,
    },
  })
  @UseGuards(AdminGuard)
  @Get("admin")
  checkAdmin(@Req() req: CustomRequest) {
    return { message: "관리자 확인 결과 입니다.", result: req.user.admin };
  }
  // 유저 정보를 다 가져오기
  @ApiOperation({ summary: "모든 유저 정보 가져오기 " })
  @ApiBody({ type: FindAllUsersOptions })
  @ApiResponse({
    example: {
      message: "유저 정보를 불러왔습니다.",
      data: [
        {
          id: 1,
          name: "아무개",
          email: "hello@hello.com",
          createDate: "2023-10-01T00:00:00.000Z",
        },
      ],
      pageData: {
        totalPage: 1,
        nextPage: null,
        prevPage: null,
      },
    },
  })
  @UseGuards(AdminGuard)
  @Get("info")
  async getAllUserInfo(@Body() body: FindAllUsersOptions) {
    const { users, pageData } = await this.getAllUser.execute({ ...body });
    return { message: "유저 정보를 불러왔습니다.", data: users, pageData };
  }
  // 유저의 정보 반환
  @ApiOperation({ summary: "유저의 정보 반환" })
  @ApiResponse({
    example: {
      message: "유저 정보를 반환합니다.",
      userInfo: {
        id: 1,
        name: "아무개",
        email: "hello@hello.com",
        createDate: "2023-10-01T00:00:00.000Z",
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get()
  async findUserInfo(@Req() req: CustomRequest) {
    const userId = req.user.id;
    const userInfo = await this.getUserInfo.execute(userId);
    return { message: "유저 정보를 반환합니다.", userInfo };
  }
}
