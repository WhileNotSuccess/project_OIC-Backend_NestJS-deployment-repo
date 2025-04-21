import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { PrideOfYjuOrmEntity } from "../entities/pride-of-yju.entity";

export const toDomain = (orm: PrideOfYjuOrmEntity): PrideOfYju => {
  return new PrideOfYju(
    orm.image,
    orm.korean,
    orm.english,
    orm.japanese,
    orm.id,
  );
};

export const toOrmEntity = (staff: PrideOfYju): PrideOfYjuOrmEntity => {
  const orm = new PrideOfYjuOrmEntity();
  if (staff.id !== undefined) {
    orm.id = staff.id;
  }
  orm.image = staff.image;
  orm.korean = staff.korean;
  orm.english = staff.english;
  orm.japanese = staff.japanese;
  return orm;
};
