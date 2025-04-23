import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async loginWithJwt(@Req() req: Request) {
   const token = req.cookies["access_token"] as string;
  }
}
