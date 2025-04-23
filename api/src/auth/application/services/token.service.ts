// // jwt 발급 담당
// import { Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";

// // 토큰 생성하기 위한 서비스
// @Injectable()
// export class TokenService {
//   constructor(private readonly jwt: JwtService) {}
//   // token 생성, 내부 정보: userId,name,email , 유효시간 1시간
//   generateAccessToken(userId: string, name?: string, email?: string): string {
//     const payload = { sub: userId, name, email };
//     const options = { expiresIn: "1h" };
//     const token = this.jwt.signAsync(payload, options);
//     return token;
//   }
// }

// jwt 발급 담당
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService) {}

  async generateAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return await this.jwt.signAsync(payload);
  }
}
