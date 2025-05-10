import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { PasswordService } from "src/auth/domain/services/password.service";
import { TransactionManager } from "src/common/ports/transaction-manager.port";

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly transaction: TransactionManager,
  ) {}

  async execute(
    jwtUser: Express.User,
    exPassword: string,
    newPlainPassword: string,
  ) {
    const userId = jwtUser.id;
    if (!userId || !newPlainPassword)
      throw new Error("정보가 잘못 되었습니다.");
    const check = await this.authRepository.findByUserId(userId);
    if (!check) {
      throw new BadRequestException("유저 정보를 다시 확인해 주세요.");
    }
    if (!check.hashedPassword) {
      throw new BadRequestException("해당 유저는 구글 계정입니다.");
    }
    const checkPassword = await this.passwordService.compare(
      exPassword,
      check.hashedPassword,
    );
    if (!checkPassword) {
      throw new BadRequestException("계정 정보를 다시 확인해 주세요.");
    }
    const newPassword = await this.passwordService.hash(newPlainPassword);
    check.updatePassword(newPassword);

    const result = await this.transaction.execute(async (queryRunner) => {
      return await this.authRepository.save(queryRunner, check);
    });
    return result;
  }
}
