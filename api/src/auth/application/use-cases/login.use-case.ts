import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { PasswordService } from "src/auth/domain/services/password.service";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { TokenService } from "../services/token.service";
import { LoginInput } from "../dto/login-input.dto";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    input: LoginInput,
  ): Promise<{ userId: number; accessToken: string }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user?.id) throw new BadRequestException("이메일이 존재하지 않습니다.");
    const credential = await this.authRepository.findByUserId(user.id);
    if (!credential) throw new BadRequestException("인증 정보가 없습니다.");
    if (!credential.hashedPassword)
      throw new BadRequestException("해당 이메일은 google로그인 계정입니다.");
    const isValid = await this.passwordService.compare(
      input.password,
      credential.hashedPassword,
    );
    if (!isValid) throw new BadRequestException("비밀번호가 틀렸습니다.");

    const accessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.name,
      user.email,
    );
    return {
      userId: user.id,
      accessToken,
    };
  }
}
