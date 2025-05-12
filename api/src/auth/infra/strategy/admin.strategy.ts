import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
  constructor(private readonly configService: ConfigService) {
    // jwt 토큰 시크릿 키 받아오기
    const jwtSecret = configService.get<string>(
      process.env.NODE_ENV === "test" ? "JWT_TEST_SECRET" : "JWT_SECRET",
    );
    // process.env.NODE_ENV === "test"
    //   ? configService.get<string>("JWT_SECRET")
    //   : configService.get<string>("JWT_TEST_SECRET");
    if (!jwtSecret) throw new Error("토큰 시크릿키를 확인해주세요");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (request.cookies?.["access_token"] as string) ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { id: number; name: string; email: string }) {
    const adminEmail = this.configService.get<string>(
      process.env.NODE_ENV == "test" ? "ADMIN_TEST_EMAIL" : "ADMIN_EMAIL",
    );
    if (payload.email !== adminEmail) {
      throw new UnauthorizedException("관리자만 접근 가능합니다.");
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      admin: true,
    };
  }
}
