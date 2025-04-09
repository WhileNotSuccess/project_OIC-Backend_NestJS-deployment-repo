import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

interface RequestWithCookie extends Request {
  cookies: { [key: string]: string };
}
const BaseStrategy = PassportStrategy(Strategy, "jwt") as new (
  ...args: any[]
) => any;

@Injectable()
export class JwtStrategy extends BaseStrategy {
  // 쿠키에서 정보를 빼기위한 전략
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookie) => {
          let token: string | null = null;
          if (request.cookies) {
            token = request.cookies["access_token"];
          }
          return token;
        },
      ]), // 쿠키를 뽑아옴 없을경우 null, 있으면 암호화 문자열
      ignoreExpiration: false, // 만료 설정 적용
      secretOrKey: process.env.JWT_SECRET, // 암호화 키
    });
  }

  validate(payload: { id: string; username: string; email: string }) {
    return {
      sub: payload.id,
      name: payload.username,
      email: payload.email,
    };
  }
}
