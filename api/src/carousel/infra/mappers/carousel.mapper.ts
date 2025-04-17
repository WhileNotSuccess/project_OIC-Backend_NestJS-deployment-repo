import { Carousel } from "../../domain/entities/carousel.entity";
import { CarouselOrmEntity } from "../entities/carousel.entity";

// export const toDomain = (orm: CarouselOrmEntity): ReturnCarousel => {
//   return new ReturnCarousel(
//     orm.image,
//     orm.postId,
//     orm.KoreanTitle || orm.EnglishTitle || orm.JapaneseTitle,
//     orm.KoreanDescription || orm.EnglishDescription || orm.JapaneseDescription,
//     orm.id,
//   );
// }; //domain으로 변환
export const toDomain = (orm: CarouselOrmEntity): Carousel => {
  return new Carousel(
    orm.image,
    orm.postId,
    orm.koreanTitle,
    orm.koreanDescription,
    orm.englishTitle,
    orm.englishDescription,
    orm.japaneseTitle,
    orm.japaneseDescription,
    orm.id,
  );
}; //getOne이 열을 그대로 내보내기 위해 만듬

export const toOrmEntity = (carousel: Carousel): CarouselOrmEntity => {
  const orm = new CarouselOrmEntity();
  if (carousel.id !== undefined) {
    orm.id = carousel.id;
  }
  orm.image = carousel.image;
  orm.postId = carousel.postId;
  orm.koreanTitle = carousel.koreanTitle;
  orm.koreanDescription = carousel.koreanDescription;
  orm.englishTitle = carousel.englishTitle;
  orm.englishDescription = carousel.englishDescription;
  orm.japaneseTitle = carousel.japaneseTitle;
  orm.japaneseDescription = carousel.japaneseDescription;
  return orm;
}; //entity로 변환
