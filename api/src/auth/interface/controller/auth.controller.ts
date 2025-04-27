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
import { Request, Response } from "express";
import { LinkGoogleUseCase } from "src/auth/application/use-cases/link-google.use-case";
import { LoginWithGoogleUseCase } from "src/auth/application/use-cases/login-with-google.use-case";
import { LoginUseCase } from "src/auth/application/use-cases/login.use-case";
import { GoogleLinkAuthGuard } from "src/auth/infra/guards/google-link.guard";
import { GoogleAuthGuard } from "src/auth/infra/guards/google.guard";
import { JwtLinkGuard } from "src/auth/infra/guards/jwt-link.guard";
import { googleUser } from "src/auth/infra/types/google.user";
import { CreateUserUseCase } from "src/auth/application/use-cases/create-user.use-case";
import { LoginInput } from "src/auth/application/dto/login-input.dto";
import { RegisterInput } from "src/auth/application/dto/register-input.dto";

@Controller("auth")
export class AuthController {
  frontUrl: string;
  constructor(
    private readonly loginGoogle: LoginWithGoogleUseCase,
    private readonly configService: ConfigService,
    private readonly loginJwt: LoginUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly googleLink: LinkGoogleUseCase,
  ) {
    // const frontUrl = this.configService.get("FRONTEND_URL") as string;
    // if (frontUrl) this.frontUrl = frontUrl;
    this.frontUrl = this.configService.get("FRONTEND_URL")!;
  }
  //구글 로그인
  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {
    return "googleLogin";
  }
  // 구글 리다이렉트
  @UseGuards(GoogleAuthGuard)
  @Get("google/redirect")
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as googleUser;
    const { accessToken } = await this.loginGoogle.execute({
      googleId: user.sub,
    });
    res.cookie("access_token", accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(`${this.frontUrl}`);
  }
  // 일반 로그인
  @Post("login")
  async loginWithJwt(@Body() body: LoginInput, @Res() res: Response) {
    const { accessToken } = await this.loginJwt.execute(body);
    res.cookie("access_token", accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      secure: false,
      // sameSite: "none",
      sameSite: "lax",
      // domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(`${this.frontUrl}`);
    res.end();
  }
  // 일반 회원가입
  @Post("register")
  async registerWithJWT(@Body() body: RegisterInput) {
    await this.createUser.execute({
      name: body.name,
      email: body.email,
      plainPassword: body.password,
    });
    return { message: "회원가입되었습니다." };
  }
  // 구글 연동
  @UseGuards(JwtLinkGuard, GoogleLinkAuthGuard)
  @Get("google/link")
  googleLinkLogin() {
    return "googleLogin";
  }
  // 구글 연동 리다이렉트
  @UseGuards(JwtLinkGuard, GoogleLinkAuthGuard)
  @Get("google/link/redirect")
  async googleLinkRedirect(@Req() req: Request, @Res() res: Response) {
    const userFromJWT = req.customData?.jwtUser;
    const googleUser = req.customData?.googleUser;
    if (!userFromJWT || !googleUser)
      throw new BadRequestException("로그인이 되어있는지 다시 확인해주세요.");

    const token = await this.googleLink.execute(userFromJWT, googleUser);
    res.cookie("access_token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(this.frontUrl);
  }
}
