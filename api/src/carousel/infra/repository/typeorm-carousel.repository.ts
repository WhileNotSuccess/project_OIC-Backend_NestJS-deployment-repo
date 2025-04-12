import { BadRequestException, Injectable } from "@nestjs/common";
import { Carousel } from "../../domain/entities/carousel.entity";
import { CarouselRepository } from "../../domain/repository/carousel.repository";
import { DataSource } from "typeorm";
import { toDomain, toOrmEntity } from "../mappers/carousel.mapper";
import { CarouselOrmEntity } from "../entites/carousel.entity";
import { transactional } from "src/common/utils/transaction-helper";

@Injectable()
export class TypeormCarouselRepository extends CarouselRepository {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async create(carouselData: Partial<Carousel>): Promise<Carousel> {
    const carousel = new Carousel( // entity 생성
      carouselData.image!,
      carouselData.postId!,
      carouselData.koreanTitle!,
      carouselData.koreanDescription!,
      carouselData.englishTitle!,
      carouselData.englishDescription!,
      carouselData.japaneseTitle!,
      carouselData.japaneseDescription!,
      carouselData.id,
    );
    const orm = toOrmEntity(carousel);

    const saved = await transactional<CarouselOrmEntity>(
      this.dataSource,
      async (queryRunner) => {
        return await queryRunner.manager.save(orm);
      },
    );

    return toDomain(saved);
  }

  async getOne(id: number): Promise<Carousel | null> {
    const orm = await this.dataSource.manager.findOneBy(CarouselOrmEntity, {
      id,
    });
    return orm ? toDomain(orm) : null;
  }
  async getAll(): Promise<Carousel[]> {
    const ormList = await this.dataSource.manager.find(CarouselOrmEntity);
    // const queryBuilder = this.dataSource
    //   .createQueryBuilder()
    //   .from(CarouselOrmEntity, "caro")
    //   .select("caro.id as id, caro.image as image, caro.postId as postId");
    // switch (language) {
    //   case "english":
    //     queryBuilder.addSelect(
    //       "caro.EnglishTitle as EnglishTitle, caro.EnglishDescription as EnglishDescription",
    //     );
    //     break;
    //   case "japanese":
    //     queryBuilder.addSelect(
    //       "caro.JapaneseTitle as JapaneseTitle, caro.JapaneseDescription as JapaneseDescription",
    //     );
    //     break;
    //   default:
    //     queryBuilder.addSelect(
    //       "caro.KoreanTitle as KoreanTitle, caro.KoreanDescription as KoreanDescription",
    //     );
    // }
    // const ormList = await queryBuilder.getMany();
    return ormList.map(toDomain);
  }

  async update(
    id: number,
    carouselData: Partial<Carousel>,
  ): Promise<Carousel | null> {
    const existing = await this.getOne(id);
    if (!existing)
      throw new BadRequestException("해당 id의 캐러셀이 존재하지 않습니다.");

    const updated = new Carousel(
      carouselData.image ?? existing.image,
      carouselData.postId ?? existing.postId,
      carouselData.koreanTitle ?? existing.koreanTitle,
      carouselData.koreanDescription ?? existing.koreanDescription,
      carouselData.englishTitle ?? existing.englishTitle,
      carouselData.englishDescription ?? existing.englishDescription,
      carouselData.japaneseTitle ?? existing.japaneseTitle,
      carouselData.japaneseDescription ?? existing.japaneseDescription,
      id,
    );
    const orm = toOrmEntity(updated);
    await transactional(this.dataSource, async (queryRunner) => {
      await queryRunner.manager.update(CarouselOrmEntity, { id }, orm);
    });
    const result = await this.getOne(id);
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const result = await transactional(this.dataSource, async (queryRunner) => {
      return await queryRunner.manager.delete(CarouselOrmEntity, {
        id,
      });
    });
    return result.affected !== 0;
  }
}
