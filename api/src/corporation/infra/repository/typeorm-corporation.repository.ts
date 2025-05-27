import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { transactional } from "src/common/utils/transaction-helper";
import { Corporation } from "src/corporation/domain/entities/corporation.entity";
import { Country } from "src/corporation/domain/entities/country.entity";
import { CorporationRepository } from "src/corporation/domain/repository/corporation.repository";
import { DataSource } from "typeorm";
import { CorporationOrmEntity } from "../entities/corporation.entity";
import {
  toDomainCorporation,
  toDomainCountry,
} from "../mapper/corporation.mapper";
import { CountryOrmEntity } from "../entities/country.entity";

@Injectable()
export class TypeormCorporationRepository extends CorporationRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }
  async countCountry(): Promise<number> {
    const result = await this.dataSource.manager.count(CountryOrmEntity);
    return result;
  }
  async countCorporation(): Promise<number> {
    const result = await this.dataSource.manager.count(CorporationOrmEntity);
    return result;
  }
  async createCorporation(dto: Partial<Corporation>): Promise<Corporation> {
    const result = await transactional<CorporationOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.save(CorporationOrmEntity, dto);
      },
    );
    return toDomainCorporation(result);
  }
  async updateCorporation(
    dto: Partial<Corporation>,
    id: number,
  ): Promise<Corporation> {
    const result = await transactional<CorporationOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        await queryRunner.manager.update(CorporationOrmEntity, { id }, dto);
        const result = await queryRunner.manager.findOneBy(
          CorporationOrmEntity,
          {
            id,
          },
        );
        if (!result) {
          throw new InternalServerErrorException("updateCorporation 에러");
        }
        return result;
      },
    );
    return toDomainCorporation(result);
  }
  async deleteCorporation(id: number): Promise<boolean> {
    const deleteResult = await transactional<boolean>(
      this.dataSource,
      async (queryRunner) => {
        const result = await queryRunner.manager.delete(
          CorporationOrmEntity,
          id,
        );
        return typeof result.affected === "number" && result.affected > 0;
      },
    );
    return deleteResult;
  }
  async createCountry(dto: Partial<Country>): Promise<Country> {
    const result = await transactional<CountryOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.save(CountryOrmEntity, dto);
      },
    );
    return toDomainCountry(result);
  }
  async updateCountry(dto: Partial<Country>, id: number): Promise<Country> {
    const result = await transactional<CountryOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        await queryRunner.manager.update(CountryOrmEntity, { id }, dto);
        const result = await queryRunner.manager.findOneBy(CountryOrmEntity, {
          id,
        });
        if (!result) {
          throw new InternalServerErrorException("updateCorporation 에러");
        }
        return result;
      },
    );
    return toDomainCountry(result);
  }
  async deleteCountry(id: number): Promise<boolean> {
    const deleteResult = await transactional<boolean>(
      this.dataSource,
      async (queryRunner) => {
        const result = await queryRunner.manager.delete(CountryOrmEntity, {
          id,
        });
        return typeof result.affected === "number" && result.affected > 0;
      },
    );
    return deleteResult;
  }
  async getCorporationByCountryId(countryId: number): Promise<Corporation[]> {
    const result = await this.dataSource.manager.findBy(CorporationOrmEntity, {
      countryId,
    });
    return result.map(toDomainCorporation);
  }
  async getAllCorporation(): Promise<Corporation[]> {
    const result = await this.dataSource.manager.find(CorporationOrmEntity);
    return result.map(toDomainCorporation);
  }
  async getAllCountry(): Promise<Country[]> {
    const result = await this.dataSource.manager.find(CountryOrmEntity);
    return result.map(toDomainCountry);
  }
}
