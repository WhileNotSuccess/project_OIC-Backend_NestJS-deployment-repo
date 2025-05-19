import { Injectable } from "@nestjs/common";
import { TransactionManager } from "src/common/ports/transaction-manager.port";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repositories/user.repository";

@Injectable()
export class ChangeUserName {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transaction: TransactionManager,
  ) {}
  async execute(id: number, name: string): Promise<User> {
    const updatedUser = await this.transaction.execute(async (queryRunner) => {
      const user = await this.userRepository.updateName(queryRunner, id, name);
      return user;
    });
    return updatedUser;
  }
}
