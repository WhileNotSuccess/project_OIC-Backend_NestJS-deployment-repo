import { Body, Controller, Get, Patch, ValidationPipe } from "@nestjs/common";
import { UsersService } from "src/users/application/services/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  //유저들 정보 가져오기
  @Get("info")
  async usersInfo() {
    const users = await this.service.AllUsersInfo();
    return users;
  }

  //유저 이름 변경
  @Patch("change")
  async userInfo(@Body("name", new ValidationPipe()) name: string) {
    const id = 1;
    const result = await this.service.userNameChange(id, name);
    if (result == null) return { message: "등록된 유저가 없습니다." };
    return {
      message: `유저정보 변경에 ${result ? "성공" : "실패"}하였습니다.`,
    };
  }
  //유저가 관리지인지 확인
  @Get("check")
  checkAdmin() {
    const user = { id: 1, email: "1234@gmail.com", name: "1234" };
    const result = this.service.checkAdminEmail(user);
    return { result };
  }
}
