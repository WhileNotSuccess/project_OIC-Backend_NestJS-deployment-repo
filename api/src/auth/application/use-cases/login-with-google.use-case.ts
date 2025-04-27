import { Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { TokenService } from "../services/token.service";
import { UserRepository } from "src/users/domain/repositories/user.repository";

export interface LoginWithGoogleInput {
  googleId: string;
}

@Injectable()
export class LoginWithGoogleUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}
  async execute(
    input: LoginWithGoogleInput,
  ): Promise<{ userId: number; accessToken: string }> {
    // googleId로 유저 찾기
    const auth = await this.authRepository.findByGoogleId(input.googleId);
    if (!auth?.userId) throw new Error("연결된 계정을 찾을 수 없습니다.");
    const user = await this.userRepository.findById(auth.userId);
    if (!user) throw new Error("연결된 계정을 찾을 수 없습니다.");

    // accessToken 발급
    const accessToken = await this.tokenService.generateAccessToken(
      auth.userId,
      user.name,
      user.email,
    );
    return { userId: auth.userId, accessToken };
  }
}
