import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { StaffOrmEntity } from "../entities/staff.entity";
import { StaffRepository } from "src/staff/domain/repository/staff.repository";
import { toDomain, toOrmEntity } from "../mappers/staff.mapper";
import { Staff } from "src/staff/domain/entities/staff.entity";

@Injectable()
export class TypeormStaffRepository extends StaffRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async getOne(id: number): Promise<Staff | null> {
    const orm = await this.dataSource.manager.findOneBy(StaffOrmEntity, { id });
    return orm ? toDomain(orm) : null;
  }

  async getAll(): Promise<Staff[]> {
    const ormList = await this.dataSource.manager.find(StaffOrmEntity);
    return ormList.map(toDomain);
  }

  async create(staffData: Partial<Staff>): Promise<Staff> {
    const staff = new Staff(
      staffData.name!,
      staffData.phoneNumber!,
      staffData.role!,
      staffData.id,
    );
    const orm = toOrmEntity(staff);
    const saved = await this.dataSource.manager.save(orm);
    return toDomain(saved);
  }

  async update(id: number, updateData: Partial<Staff>): Promise<Staff | null> {
    const existing = await this.getOne(id);
    if (!existing) return null;

    const updated = new Staff(
      updateData.name ?? existing.name,
      updateData.phoneNumber ?? existing.phoneNumber,
      updateData.role ?? existing.role,
      id,
    );
    const orm = toOrmEntity(updated); // ✅ 여기도
    await this.dataSource.manager.update(StaffOrmEntity, { id }, orm);

    return this.getOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.dataSource.manager.delete(StaffOrmEntity, { id });
    return result.affected !== 0;
  }

  // 헬퍼: undefined 필드 제거
  private omitUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined),
    ) as Partial<T>;
  }
}
