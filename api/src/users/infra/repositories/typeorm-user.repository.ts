import { User } from "src/users/domain/entities/user.entity";
import {
  FindAllUsersOptions,
  UserRepository,
} from "src/users/domain/repositories/user.repository";
import { DataSource } from "typeorm";
import { UserOrmEntity } from "../entities/user.entity";
import { toDomain, toOrmEntity } from "../mappers/user.mapper";
import { transactional } from "src/common/utils/transaction-helper";

export class TypeormUserRepository extends UserRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async save(user: User): Promise<User> {
    const newUser = await transactional(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.save(UserOrmEntity, toOrmEntity(user));
      },
    );
    return newUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.dataSource.manager.findOneBy(UserOrmEntity, {
      email,
    });
    return user ? toDomain(user) : null;
  }
  async findById(userId: string): Promise<User | null> {
    const user = await this.dataSource.manager.findOneBy(UserOrmEntity, {
      id: userId,
    });
    return user ? toDomain(user) : null;
  }
  async findAll(
    options: FindAllUsersOptions,
  ): Promise<{ user: User[]; total: number }> {
    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .from(UserOrmEntity, "user")
      .take(options.limit)
      .skip(options.page * options.limit)
      .orderBy(`user.${options.sortBy}`, options.order);

    // if (options.keyword) {
    //   queryBuilder.where("user.:sortBy LIKE :keyword", {
    //     sortBy: options.sortBy,
    //     keyword: options.keyword,
    //   });
    // }
    // 찾으려는 단어가 있을 경우
    if (options.keyword) {
      // 찾으려는 열을 sortBy로 한정, keyword를 변수 할당해서 검색
      queryBuilder.where(`user.${options.sortBy} LIKE :keyword`, {
        keyword: `%${options.keyword}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();
    return { user: result.map(toDomain), total };
  }
}
