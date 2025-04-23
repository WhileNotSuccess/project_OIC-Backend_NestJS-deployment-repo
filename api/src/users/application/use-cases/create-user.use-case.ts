import { Injectable } from "@nestjs/common";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repositories/user.repository";

export interface createUserInput {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: createUserInput): Promise<User> {
    // 같은 email의 사용자가 존재하는지 확인
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new Error("사용중인 이메일 입니다.");
    // 없으면 받은 input 정보의 name, email을 user 테이블에 저장
    const user = User.create(input.name, input.email);
    await this.userRepository.save(user);
    return user;
  }
}
