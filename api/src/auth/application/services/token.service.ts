// jwt 발급 담당
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// 토큰 생성하기 위한 서비스
@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}
  // token 생성, 내부 정보: userId,name,email , 유효시간 1시간
  async generateAccessToken(
    userId: number,
    name: string,
    email: string,
  ): Promise<string> {
    const payload = { id: userId, name, email };
    const options = { expiresIn: "1h" };
    const token = await this.jwt.signAsync(payload, options);
    return token;
  }
}