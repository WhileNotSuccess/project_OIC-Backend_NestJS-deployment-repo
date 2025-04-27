import { AuthRepository } from "src/auth/domain/repositories/user-credential.repository";
import { DataSource, QueryRunner } from "typeorm";
import { AuthOrmEntity } from "../entities/auth.entity";
import { Auth } from "src/auth/domain/entities/auth.entity";
import { toDomain, toOrmEntity } from "../mappers/auth.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeormAuthRepository extends AuthRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async save(queryRunner: QueryRunner, credential: Auth): Promise<boolean> {
    const auth = await queryRunner.manager.save(
      AuthOrmEntity,
      toOrmEntity(credential),
    );
    return !!auth;
  }

  async findByGoogleId(googleId: string): Promise<Auth | null> {
    const user = await this.dataSource
      .getRepository(AuthOrmEntity)
      .createQueryBuilder("auth")
      .where("auth.googleId =:googleId", { googleId })
      .getOne();
    if (!user) return null;
    return toDomain(user);
  }
  async findByUserId(userId: number): Promise<Auth | null> {
    const user = await this.dataSource
      .getRepository(AuthOrmEntity)
      .createQueryBuilder("auth")
      .where("auth.userId = :userId", { userId })
      .getOne();
    if (!user) return null;
    return toDomain(user);
  }
}
