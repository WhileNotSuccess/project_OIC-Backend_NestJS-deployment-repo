import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

interface RequestWithCookie extends Request {
  cookies: { [key: string]: string };
}
const BaseStrategy = PassportStrategy(Strategy, "admin") as new (
  ...args: any[]
) => any;

@Injectable()
export class AdminStrategy extends BaseStrategy {
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
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: { id: number; username: string; email: string }) {
    if (payload.email !== process.env.ADMIN_EMAIL) {
      throw new UnauthorizedException("관리자만 접근 가능합니다.");
    }
    return {
      id: payload.id,
      name: payload.username,
      email: payload.email,
    };
  }
}
