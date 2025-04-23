import { User } from "src/users/domain/entities/user.entity";
import { UserOrmEntity } from "../entities/user.entity";

export const toOrmEntity = (user: User): UserOrmEntity => {
  const orm = new UserOrmEntity();
  orm.email = user.email;
  orm.name = user.name;
  if (user.id) orm.id = user.id;
  if (user.createDate) orm.createDate = user.createDate;
  return orm;
};
export const toDomain = (userOrm: UserOrmEntity): User => {
  const domain = new User(
    userOrm.name,
    userOrm.email,
    userOrm.id,
    userOrm.createDate,
  );
  return domain;
};
