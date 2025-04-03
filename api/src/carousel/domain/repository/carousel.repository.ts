import { Carousel } from "../entities/carousel.entity";

export abstract class CarouselRepository{
    abstract create(carouselData:Partial<Carousel>):Promise<Carousel>
    abstract update(id:number, carouselData:Partial<Carousel>):Promise<Carousel|null>
    abstract delete(id:number):Promise<boolean>
    abstract getAll():Promise<Carousel[]>
    abstract getOne(id):Promise<Carousel|null>
}