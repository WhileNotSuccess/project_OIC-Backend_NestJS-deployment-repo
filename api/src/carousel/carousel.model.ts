import { Module } from "@nestjs/common";
import { CarouselController } from "./interface/controllers/carousel.controller";

@Module({
    controllers:[CarouselController],
    providers:[]
})
export class CarouselModule{}
