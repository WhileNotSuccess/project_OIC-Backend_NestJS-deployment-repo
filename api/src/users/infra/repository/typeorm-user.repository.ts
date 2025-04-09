import { Users } from "src/users/domain/entities/users.entity";
import { UsersRepository } from "src/users/domain/repository/users.repository";
import { DataSource, DeleteResult, UpdateResult } from "typeorm";
import { UserOrmEntity } from "../entities/user.entity";
import { toDomain, toOrmEntity } from "../mappers/users.mapper";
import { transactional } from "src/common/utils/transaction-helper";

export class UsersOrmRepository extends UsersRepository {
  constructor(private dataSource: DataSource) {
    super();
  }
  async create(usersData: Users): Promise<Users | null> {
    const exist = await this.dataSource
      .createQueryBuilder()
      .from(UserOrmEntity, "user")
      .where("user.email = :email", { email: usersData.email })
      .orWhere("user.googleId = :googleId", { googleId: usersData.googleId })
      .getOne();
    if (exist) return null; //같은 이메일의 유저가 있을 경우 null 반환
    const user = new Users(
      usersData.name,
      usersData.email,
      usersData.password,
      usersData.googleId,
      usersData.id,
    );
    const orm = toOrmEntity(user);
    const result = await transactional<UserOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.save(orm);
      },
    );
    return toDomain(result); // 만든 유저 정보를 반환
  }
  async updateName(id: number, name: string): Promise<boolean | null> {
    const existing = await this.dataSource.manager.findOneBy(UserOrmEntity, {
      id,
    });
    if (!existing) return null; // 유저가 없을 경우 null 반환
    const updated = new Users(
      name ?? existing.name,
      existing.email,
      existing.password,
      existing.googleId,
      id,
    );
    const orm = toOrmEntity(updated);
    const result = await transactional<UpdateResult>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.update(UserOrmEntity, { id }, orm);
      },
    );
    return result.affected !== 0; // 수정이 되었는지의 여부를 boolean으로 반환
  }
  async delete(id: number): Promise<boolean> {
    const result = await transactional<DeleteResult>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.delete(UserOrmEntity, { id });
      },
    );
    return result.affected !== 0;
  }
  async getOneByEmail(email: string): Promise<Users | null> {
    const user = await this.dataSource
      .createQueryBuilder()
      .from(UserOrmEntity, "user")
      .select(
        "user.id as id, user.name as name, user.email as email,user.password as password",
      )
      .where("user.email = :email", { email })
      .getOne();
    return user ? toDomain(user) : null;
  }
  async getOneByGoogleId(googleId: string): Promise<Users | null> {
    const user = await this.dataSource
      .createQueryBuilder()
      .from(UserOrmEntity, "user")
      .select(
        "user.id as id, user.name as name, user.email as email,user.password as password",
      )
      .where("user.googleId = :googleId", { googleId })
      .getOne();
    return user ? toDomain(user) : null;
  }
  async getAll(): Promise<Users[] | null> {
    const userList = await this.dataSource
      .createQueryBuilder()
      .select("user.id as id, user.name as name, user.email as email")
      .from(UserOrmEntity, "user")
      .getMany();
    return userList.map(toDomain);
  }
}
