// src/common/infra/typeorm-transaction-manager.ts
import { Injectable } from "@nestjs/common";
import { TransactionManager } from "../ports/transaction-manager.port";
import { DataSource, QueryRunner } from "typeorm";

@Injectable()
export class TypeormTransactionManager implements TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await work(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
