import { User } from "src/users/domain/entities/user.entity";
import {
  FindAllUsersOptions,
  UserRepository,
} from "src/users/domain/repositories/user.repository";
import { DataSource, QueryRunner } from "typeorm";
import { UserOrmEntity } from "../entities/user.entity";
import { toDomain, toOrmEntity } from "../mappers/user.mapper";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TypeormUserRepository extends UserRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async save(queryRunner: QueryRunner, user: User): Promise<User> {
    const newUser = await queryRunner.manager.save(
      UserOrmEntity,
      toOrmEntity(user),
    );
    return toDomain(newUser);
  }
  async updateName(
    queryRunner: QueryRunner,
    id: number,
    name: string,
  ): Promise<User> {
    const exist = await this.dataSource.manager.findOneBy(UserOrmEntity, {
      id,
    });
    if (!exist) throw new BadRequestException("잘못된 접근 입니다.");
    await queryRunner.manager.update(UserOrmEntity, id, { name });
    const user = await queryRunner.manager.findOne(UserOrmEntity, {
      where: { id },
    });
    if (!user) throw new BadRequestException("잘못된 접근 입니다.");
    return toDomain(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.dataSource.manager.findOne(UserOrmEntity, {
        where: { email },
      });
      return user ? toDomain(user) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async findById(userId: number): Promise<User | null> {
    try {
      const user = await this.dataSource.manager.findOne(UserOrmEntity, {
        where: {
          id: userId,
        },
      });
      return user ? toDomain(user) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async findAll(
    options: FindAllUsersOptions,
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.dataSource
      .getRepository(UserOrmEntity)
      .createQueryBuilder("user")
      .take(options.limit)
      .skip((options.page - 1) * options.limit)
      .orderBy(`user.${options.sortBy}`, options.order);
    // 찾으려는 단어가 있을 경우
    if (options.keyword) {
      // 찾으려는 열을 sortBy로 한정, keyword를 변수 할당해서 검색
      queryBuilder.where(`user.${options.sortBy} LIKE :keyword`, {
        keyword: `%${options.keyword}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();
    return { users: result.map(toDomain), total };
  }
}
