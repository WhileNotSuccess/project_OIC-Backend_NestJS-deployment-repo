import { Injectable } from "@nestjs/common";
import { User } from "src/users/domain/entities/user.entity";
import {
  FindAllUsersOptions,
  UserRepository,
} from "src/users/domain/repositories/user.repository";

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  // 관리자가 볼 user 정보 불러오기
  async execute(input: FindAllUsersOptions): Promise<{
    users: User[];
    pageData: {
      totalPage: number;
      nextPage: number | null;
      prevPage: number | null;
    };
  }> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const { users, total } = await this.userRepository.findAll({
      page,
      limit,
      keyword: input?.keyword,
      sortBy: input.sortBy ?? "createDate",
      order: input.order ?? "DESC",
    });
    const totalPage = Math.ceil(total / limit);
    const pageData = {
      result: total,
      totalPage,
      nextPage: page < totalPage ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
    return {
      users: users.map((user) => ({
        id: user.id!,
        name: user.name,
        email: user.email,
        createDate: user.createDate,
      })),
      pageData,
    };
  }
}
