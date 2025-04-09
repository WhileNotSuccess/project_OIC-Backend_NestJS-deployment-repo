import { Users } from "src/users/domain/entities/users.entity";
import { UserOrmEntity } from "../entities/user.entity";

export const toDomain = (orm: UserOrmEntity): Users => {
  return new Users(orm.name, orm.password, orm.email, orm.googleId, orm.id);
};
export const toOrmEntity = (domain: Users): UserOrmEntity => {
  const orm = new UserOrmEntity();
  if (domain.id !== undefined) {
    orm.id = domain.id;
  }
  orm.name = domain.name;
  orm.email = domain.email;
  orm.password = domain.password;
  orm.googleId = domain.googleId;
  return orm;
};
