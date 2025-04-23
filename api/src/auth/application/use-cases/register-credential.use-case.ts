import { Injectable } from "@nestjs/common";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { PasswordService } from "src/auth/domain/services/password.service";

export interface RegisterCredentialInput {
  userId: string;
  plainPassword: string;
}
// 일반 회원가입
@Injectable()
export class RegisterCredentialUseCase {
  constructor(
    private readonly credentialRepository: AuthRepository,
    private readonly passwordService: PasswordService,
  ) {}
  async execute(input: RegisterCredentialInput): Promise<void> {
    // hash화 한 비밀번호
    const hash = await this.passwordService.hash(input.plainPassword);
    // 객체 생성
    const credential = new Auth(input.userId, hash);
    // 객체 저장
    await this.credentialRepository.save(credential);
  }
}
