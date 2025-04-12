import { DataSource } from "typeorm";
import { TypeormCarouselRepository } from "./typeorm-carousel.repository";
import { CarouselOrmEntity } from "../entites/carousel.entity";
import { Carousel } from "src/carousel/domain/entities/carousel.entity";

describe("TypeormCarouselRepository (Integration)", () => {
  let dataSource: DataSource;
  let repository: TypeormCarouselRepository;
  const expectValue = {
    image: "/203846-92082392.jpg",
    postId: 1,
    koreanTitle: "한글",
    koreanDescription: "한글설명",
    englishTitle: "영어",
    englishDescription: "영어설명",
    japaneseTitle: "일본어",
    japaneseDescription: "일본어설명",
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [CarouselOrmEntity],
    });
    await dataSource.initialize();
    repository = new TypeormCarouselRepository(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should create and return a carousel", async () => {
    const input = new Carousel(
      expectValue.image,
      expectValue.postId,
      expectValue.koreanTitle,
      expectValue.koreanDescription,
      expectValue.englishTitle,
      expectValue.englishDescription,
      expectValue.japaneseTitle,
      expectValue.japaneseDescription,
      1,
    );
    const created = await repository.create(expectValue);

    expect(created).toStrictEqual(input);
  });
  it("should get all carousel", async () => {});
});
