import { Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { TokenService } from "../services/token.service";

export interface LoginWithGoogleInput {
  googleId: string;
}

@Injectable()
export class LoginWithGoogleUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {}
  async execute(
    input: LoginWithGoogleInput,
  ): Promise<{ userId: string; accessToken: string }> {
    // googleId로 유저 찾기
    const user = await this.authRepository.findByGoogleId(input.googleId);
    if (!user?.userId) throw new Error("연결된 계정을 찾을 수 없습니다.");
    // accessToken 발급
    const accessToken = this.tokenService.generateAccessToken(user.userId);
    return { userId: user.userId, accessToken };
  }
}
