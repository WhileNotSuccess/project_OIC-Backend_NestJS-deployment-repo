import { Injectable } from "@nestjs/common";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repositories/user.repository";

@Injectable()
export class GetUserInfo {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(subId: number): Promise<User> {
    const user = await this.userRepository.findById(subId);
    if (!user) throw new Error("등록되지 않은 유저입니다.");
    return user;
  }
}
