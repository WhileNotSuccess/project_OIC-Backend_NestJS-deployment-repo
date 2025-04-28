import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { transactional } from "src/common/utils/transaction-helper";
import { DataSource } from "typeorm";

export interface CreateGoogleUserInput {
  name: string;
  email: string;
  googleId: string;
}

@Injectable()
export class CreateGoogleUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: CreateGoogleUserInput): Promise<User> {
    // 같은 email의 사용자가 존재하는지 확인
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new BadRequestException("사용중인 이메일 입니다.");

    const createdUser = await transactional<User>(
      this.dataSource,
      async (queryRunner) => {
        // 없으면 받은 input 정보의 name, email을 user 테이블에 저장
        const user = User.create(input.name, input.email);
        const userInfo = await this.userRepository.save(queryRunner, user);
        // 객체 생성
        const credential = new Auth(userInfo.id!, undefined, input.googleId);
        // 객체 저장
        await this.authRepository.save(queryRunner, credential);
        return userInfo;
      },
    );
    return createdUser;
  }
}
