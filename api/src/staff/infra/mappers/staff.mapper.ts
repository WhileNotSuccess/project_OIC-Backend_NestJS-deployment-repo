import { Staff } from "src/staff/domain/entities/staff.entity";
import { StaffOrmEntity } from "../entities/staff.entity";

export const toDomain = (orm: StaffOrmEntity): Staff => {
  return new Staff(
    orm.name,
    orm.position,
    orm.phone,
    orm.email,
    orm.team,
    orm.position_jp,
    orm.team_jp,
    orm.position_en,
    orm.team_en,
    orm.order,
    orm.role,
    orm.role_en,
    orm.role_jp,
    orm.id,
  );
};
