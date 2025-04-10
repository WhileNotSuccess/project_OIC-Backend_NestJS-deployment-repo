import { Module } from "@nestjs/common";
import { CarouselController } from "./interface/controllers/carousel.controller";
import { CarouselService } from "./application/services/carousel.service";
import { CarouselRepository } from "./domain/repository/carousel.repository";
import { TypeormCarouselRepository } from "./infra/repository/typeorm-carousel.repository";

@Module({
  controllers: [CarouselController],
  providers: [
    CarouselService,
    { provide: CarouselRepository, useClass: TypeormCarouselRepository },
  ],
})
export class CarouselModule {}
