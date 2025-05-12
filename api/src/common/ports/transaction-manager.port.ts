import { QueryRunner } from "typeorm";

export abstract class TransactionManager {
  abstract execute<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T>;
}
