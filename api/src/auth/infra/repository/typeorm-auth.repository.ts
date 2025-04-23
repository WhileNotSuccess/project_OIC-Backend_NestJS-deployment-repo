import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { DataSource } from "typeorm";
import { AuthOrmEntity } from "../entities/auth.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { toDomain, toOrmEntity } from "../mappers/auth.mapper";
import { transactional } from "src/common/utils/transaction-helper";

export class TypeormAuthRepository extends AuthRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async save(credential: Auth): Promise<boolean> {
    const orm = toOrmEntity(credential);
    const user = await transactional(this.dataSource, async (queryRunner) => {
      return !!(await queryRunner.manager.save(AuthOrmEntity, orm));
    });
    return user;
  }

  async findByGoogleId(googleId: string): Promise<Auth | null> {
    const user = await this.dataSource
      .createQueryBuilder()
      .from(AuthOrmEntity, "auth")
      .where("auth.googleId =:googleId", { googleId })
      .getOne();
    if (!user) return null;
    return toDomain(user);
  }
  async findByUserId(userId: string): Promise<Auth | null> {
    const user = await this.dataSource
      .createQueryBuilder()
      .from(AuthOrmEntity, "auth")
      .where("auth.userId = :userId", { userId })
      .getOne();
    if (!user) return null;
    return toDomain(user);
  }
}
