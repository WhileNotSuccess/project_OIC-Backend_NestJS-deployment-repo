import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { logInDto } from "src/auth/application/dto/logIn.dto";
import { SignInDto } from "src/auth/application/dto/signIn.dto";
import { GoogleLinkAuthGuard } from "src/auth/application/guard/google-link.guard";
import { GoogleAuthGuard } from "src/auth/application/guard/google.guard";
import { JwtLinkGuard } from "src/auth/application/guard/jwt-link.guard";
import { CustomRequest } from "src/auth/application/guard/types/customRequest.type";
import { AuthService } from "src/auth/application/service/auth.service";
import { UsersRepository } from "src/users/domain/repository/users.repository";

@Controller("auth")
export class AuthController {
  frontendUrl: string | undefined;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userRepository: UsersRepository,
  ) {
    this.frontendUrl = this.configService.get("FRONTEND_URL");
  }
  //일반 회원가입
  @Post("signin")
  async CommonSignin(@Body() userdto: SignInDto) {
    const result = await this.authService.createUser(userdto);
    if (!result) return { message: "해당 이메일은 사용할 수 없습니다." };
    return { message: `회원가입에 ${result ? "성공" : "실패"}하였습니다.` };
  }
  //일반 로그인
  @Post("login")
  async CommonLogin(@Body() dto: logInDto, @Res() res: Response) {
    const userToken = await this.authService.logInUser(dto);
    if (!userToken)
      return { message: "이메일 또는 비밀번호를 다시확인하십시오." };
    res.cookie("access_token", userToken.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
    });
    return { message: "login complete" };
  }
  //구글 로그인, 회원가입
  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {
    return { message: "googleLogin" };
  }
  //구글 리다이렉트
  @Get("google/redirect")
  async googleRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    // if (req.user.newUser) {
    //   res.cookie('new_user', true, {
    //     maxAge: 60 * 60 * 1000,
    //     secure: true,
    //     sameSite: 'none',
    //     domain: process.env.COOKIE_DOMAIN,
    //   });
    // }
    if (req.user == null) {
      res.redirect(`${this.frontendUrl}/need-link`);
    }
    const user = await this.userRepository.getOneByEmail(req.user.email);
    if (user) {
      const token = await this.authService.issuesJwt(user);
      res.cookie("access_token", token.access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: process.env.COOKIE_DOMAIN,
      });
      res.redirect(`${this.frontendUrl}`);
    }
  }
  //가입된 유저의 구글 연동
  @UseGuards(GoogleLinkAuthGuard, JwtLinkGuard)
  @Get("google/link")
  googleLinkLogin() {
    return { message: "googleLogin" };
  }
  //연동시 리다이렉트
  @UseGuards(GoogleLinkAuthGuard, JwtLinkGuard)
  @Get("google/link/redirect")
  async googleLinkRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    const userFromJWT = req.customData.jwtUser;
    const googleId: string | undefined =
      req.customData?.googleUser || undefined;
    if (JSON.stringify(userFromJWT) == "{}")
      new BadRequestException("로그인 되어있는지 확인해주세요.");

    const token = await this.authService.googleLink(userFromJWT, googleId);
    res.cookie("access_token", token.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(this.frontendUrl);
  }
}
