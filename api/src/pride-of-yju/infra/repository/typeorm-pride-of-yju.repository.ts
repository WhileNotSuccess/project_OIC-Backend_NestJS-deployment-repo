import { Injectable } from "@nestjs/common";
import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { PrideOfYjuRepository } from "src/pride-of-yju/domain/repository/pride-of-yju.repository";
import { PrideOfYjuOrmEntity } from "../entities/pride-of-yju.entity";
import { toDomain, toOrmEntity } from "../mappers/pride-of-yju.mapper";
import { DataSource } from "typeorm";
import { transactional } from "src/common/utils/transaction-helper";

@Injectable()
export class TypeormPrideOfYjuRepository extends PrideOfYjuRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async getOne(id: number): Promise<PrideOfYju | null> {
    const orm = await this.dataSource.manager.findOneBy(PrideOfYjuOrmEntity, {
      id,
    });
    return orm ? toDomain(orm) : null;
    // 찾으면 domain entity로 변환시켜 반환, 없으면 null 반환
  }
  async getAll(): Promise<PrideOfYju[]> {
    const ormList = await this.dataSource.manager.find(PrideOfYjuOrmEntity);
    return ormList.map(toDomain);
    // 테이블에서 전부 꺼내 map으로 ormEntity에서 domainEntity로 변환, 반환
  }
  async create(POY: Partial<PrideOfYju>): Promise<PrideOfYju> {
    const pride = new PrideOfYju(
      POY.image!,
      POY.Korean!,
      POY.English!,
      POY.Japanese!,
      POY.id,
    );
    const orm = toOrmEntity(pride);
    const saved = await transactional(this.dataSource, async (queryRunner) => {
      return await queryRunner.manager.save(orm);
    });
    return toDomain(saved);
  }
  async update(
    id: number,
    POY: Partial<PrideOfYju>,
  ): Promise<PrideOfYju | null> {
    const existing = await this.getOne(id);
    if (!existing) return null;

    const updated = new PrideOfYju(
      POY.image ?? existing.image,
      POY.Korean ?? existing.Korean,
      POY.English ?? existing.English,
      POY.Japanese ?? existing.Japanese,
      id,
    );
    const orm = toOrmEntity(updated);
    await transactional(this.dataSource, async (queryRunner) => {
      return await queryRunner.manager.update(PrideOfYjuOrmEntity, { id }, orm);
    });
    return await this.getOne(id);
  }
  async delete(id: number): Promise<boolean> {
    const result = await transactional(this.dataSource, async (queryRunner) => {
      return await queryRunner.manager.delete(PrideOfYjuOrmEntity, {
        id,
      });
    });
    return result.affected !== 0;
  }
}
