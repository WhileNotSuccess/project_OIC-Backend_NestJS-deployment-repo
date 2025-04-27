import { Injectable } from "@nestjs/common";
import { transactional } from "src/common/utils/transaction-helper";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repositories/user.repository";
import { DataSource } from "typeorm";

@Injectable()
export class ChangeUserName {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}
  async execute(id: number, name: string): Promise<User> {
    const updatedUser = await transactional(
      this.dataSource,
      async (queryRunner) => {
        const user = await this.userRepository.updateName(
          queryRunner,
          id,
          name,
        );
        return user;
      },
    );

    return updatedUser;
  }
}
