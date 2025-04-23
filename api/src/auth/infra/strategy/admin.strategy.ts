import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
  constructor(private readonly configService: ConfigService) {
    // jwt 토큰 시크릿 키 받아오기
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) throw new Error("토큰 시크릿키를 확인해주세요");
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     let token = null;
      //     if (request && request.cookies) {
      //       token = request.cookies["access_token"];
      //     }
      //     return token;
      //   },
      // ]),
      // ignoreExpiration: false,
      // secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          (request.cookies["access_token"] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { sub: string; name: string; email: string }) {
    if (payload.email !== this.configService.get("ADMIN_EMAIL")) {
      throw new UnauthorizedException("관리자만 접근 가능합니다.");
    }
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
