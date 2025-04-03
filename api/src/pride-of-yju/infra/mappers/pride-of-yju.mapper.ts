import { PrideOfYju } from "src/pride-of-yju/domain/entities/pride-of-yju.entity";
import { PrideOfYjuOrmEntity } from "../entities/pride-of-yju.entity";

export const toDomain = (orm: PrideOfYjuOrmEntity): PrideOfYju => {
    return new PrideOfYju(
        orm.image, 
        orm.Korean,
        orm.English,
        orm.Japanese, 
        orm.id
    );
};

export const toOrmEntity = (staff: PrideOfYju): PrideOfYjuOrmEntity => {
  const orm = new PrideOfYjuOrmEntity();
  if (staff.id !== undefined) {
    orm.id = staff.id;
  }
  orm.image = staff.image;
  orm.Korean = staff.Korean;
  orm.English = staff.English;
  orm.Japanese = staff.Japanese;
  return orm;
};
