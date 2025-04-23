import { Injectable } from "@nestjs/common";
import {
  FindAllUsersOptions,
  UserRepository,
} from "src/users/domain/repositories/user.repository";

export interface GetAllUsersOutPut {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  // 관리자가 볼 user 정보 불러오기
  async execute(input: FindAllUsersOptions): Promise<GetAllUsersOutPut[]> {
    const users = await this.userRepository.findAll({
      page: input.page ?? 1,
      limit: input.limit ?? 20,
      keyword: input.keyword,
      sortBy: input.sortBy ?? "createdAt",
      order: input.order ?? "desc",
    });
    return users.map((user) => ({
      id: user.id!,
      name: user.name,
      email: user.email,
    }));
  }
}
