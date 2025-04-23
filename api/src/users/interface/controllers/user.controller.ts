import { Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";


@Controller("user")
export class UsersController {
  // 유저의 정보 반환
  @UseGuards(AuthGuard("jwt"))
  @Get()
  async findUserInfo(@Req() req) {
    

  }
  // 유저의 이름 변경
  @UseGuards(AuthGuard("jwt"))
  @Patch()
  async nameChange(@Req() req: Request) {}
  // 유저가 관리자인지 확인
  @UseGuards(AuthGuard("admin"))
  @Get("admin")
  async checkAdmin(@Req() req: Request) {}
}
