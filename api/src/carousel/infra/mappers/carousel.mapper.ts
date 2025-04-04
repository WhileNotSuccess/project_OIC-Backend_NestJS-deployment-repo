import { Carousel } from "src/carousel/domain/entities/carousel.entity";
import { CarouselOrmEntity } from "../entites/carousel.entity";

export const toDomain = (orm: CarouselOrmEntity): Carousel => {
  return new Carousel(
    orm.image,
    orm.postId,
    orm.KoreanTitle,
    orm.KoreanDescription,
    orm.EnglishTitle,
    orm.EnglishDescription,
    orm.JapaneseTitle,
    orm.JapaneseDescription,
    orm.id,
  );
}; //domain으로 변환

export const toOrmEntity = (carousel: Carousel): CarouselOrmEntity => {
  const orm = new CarouselOrmEntity();
  if (carousel.id !== undefined) {
    orm.id = carousel.id;
  }
  orm.image = carousel.image;
  orm.postId = carousel.postId;
  orm.KoreanTitle = carousel.KoreanTitle;
  orm.KoreanDescription = carousel.KoreanDescription;
  orm.EnglishTitle = carousel.EnglishTitle;
  orm.EnglishDescription = carousel.EnglishDescription;
  orm.JapaneseTitle = carousel.JapaneseTitle;
  orm.EnglishDescription = carousel.EnglishDescription;
  return orm;
}; //entity로 변환
