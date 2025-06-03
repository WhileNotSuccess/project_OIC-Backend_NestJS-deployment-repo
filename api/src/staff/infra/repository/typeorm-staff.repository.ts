import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { StaffOrmEntity } from "../entities/staff.entity";
import {
  OrderUpdate,
  StaffRepository,
} from "../../domain/repository/staff.repository";
import { toDomain } from "../mappers/staff.mapper";
import { Staff } from "../../domain/entities/staff.entity";
import { transactional } from "src/common/utils/transaction-helper";

@Injectable()
export class TypeormStaffRepository extends StaffRepository {
  async updateOrder(orderUpdate: OrderUpdate[]): Promise<void> {
    await transactional(this.dataSource, async (queryRunner) => {
      for (const { id, order } of orderUpdate) {
        await queryRunner.manager.update(StaffOrmEntity, { id }, { order });
      }
    });
  }
  async create(staffData: Partial<Staff>): Promise<Staff> {
    const staff = await transactional<StaffOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        const staff = await queryRunner.manager.save(StaffOrmEntity, staffData);
        return staff;
      },
    );
    return toDomain(staff);
  }
  async update(id: number, staffData: Partial<Staff>): Promise<Staff | null> {
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(StaffOrmEntity, { id }, staffData);
    });
    const staff = await this.dataSource.manager.findOneBy(StaffOrmEntity, {
      id,
    });
    if (!staff) return null;
    return toDomain(staff);
  }
  async delete(id: number): Promise<boolean> {
    const deleteResult = await transactional<boolean>(
      this.dataSource,
      async (queryRunner) => {
        const result = await queryRunner.manager.delete(StaffOrmEntity, id);
        return typeof result.affected === "number" && result.affected > 0;
      },
    );

    return deleteResult;
  }

  async getAll(): Promise<Staff[]> {
    const result = await this.dataSource.manager.find(StaffOrmEntity, {
      order: { order: "ASC" },
    });
    return result.map((item) => toDomain(item));
  }
  constructor(private readonly dataSource: DataSource) {
    super();
  }
}
