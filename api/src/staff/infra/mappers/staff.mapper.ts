import { Staff } from "src/staff/domain/entities/staff.entity";
import { StaffOrmEntity } from "../entities/staff.entity";

export const toDomain = (orm: StaffOrmEntity): Staff => {
  return new Staff(orm.name, orm.phoneNumber, orm.role, orm.id);
};

export const toOrmEntity = (staff: Staff): StaffOrmEntity => {
  const orm = new StaffOrmEntity();
  if (staff.id !== undefined) {
    orm.id = staff.id;
  }
  orm.name = staff.name;
  orm.phoneNumber = staff.phoneNumber;
  orm.role = staff.role;
  return orm;
};
