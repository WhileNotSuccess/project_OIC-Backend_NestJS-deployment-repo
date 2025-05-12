import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AdminGuard } from "src/shared/guards/admin.guard";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { ChangeUserName } from "src/users/application/use-cases/change-user-name-use-case";
import { GetAllUsersUseCase } from "src/users/application/use-cases/get-all-users.use-case";
import { GetUserInfo } from "src/users/application/use-cases/get-user-info.use-case";
import { FindAllUsersOptions } from "src/users/domain/repositories/user.repository";

export interface CustomRequest extends Request {
  user: {
    id: number;
    name: string;
    email: string;
    admin?: boolean;
  };
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly getAllUser: GetAllUsersUseCase,
    private readonly getUserInfo: GetUserInfo,
    private readonly changeUserName: ChangeUserName,
  ) {}

  // 유저의 이름 변경
  @UseGuards(AuthGuard)
  @Patch()
  async nameChange(@Req() req: CustomRequest, @Body("name") name: string) {
    const user = req.user;
    const updatedUser = await this.changeUserName.execute(user.id, name);
    return { message: "이름이 수정되었습니다.", userInfo: updatedUser };
  }
  // 유저가 관리자인지 확인
  @UseGuards(AdminGuard)
  @Get("admin")
  checkAdmin(@Req() req: CustomRequest) {
    return { message: "관리자 확인 결과 입니다.", result: req.user.admin };
  }
  // 유저 정보를 다 가져오기
  @UseGuards(AdminGuard)
  @Get("info")
  async getAllUserInfo(@Body() body: FindAllUsersOptions) {
    const { users, pageData } = await this.getAllUser.execute({ ...body });
    return { message: "유저 정보를 불러왔습니다.", data: users, pageData };
  }
  // 유저의 정보 반환
  @UseGuards(AuthGuard)
  @Get()
  async findUserInfo(@Req() req: CustomRequest) {
    const userId = req.user.id;
    const userInfo = await this.getUserInfo.execute(userId);
    return { message: "유저 정보를 반환합니다.", userInfo };
  }
}
