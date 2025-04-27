import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) throw new Error("토큰 시크릿키를 확인해주세요");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          (request.cookies?.["access_token"] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { id: number; name: string; email: string }) {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  }
}
