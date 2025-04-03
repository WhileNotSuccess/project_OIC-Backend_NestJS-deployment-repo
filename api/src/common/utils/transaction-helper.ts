import { BadRequestException } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

export async function transactional<T>(
  dataSource: DataSource,
  work: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const result = await work(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(`${error.sqlMessage}`);
  } finally {
    await queryRunner.release();
  }
}
