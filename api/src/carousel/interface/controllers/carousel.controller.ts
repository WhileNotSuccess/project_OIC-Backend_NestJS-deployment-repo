import { Body, Controller, Delete, Get, Injectable, Patch, Post } from "@nestjs/common";
import { CarouselService } from "src/carousel/application/services/carousel.service";

@Controller("carousel")
export class CarouselController{
    constructor(private readonly carouselService:CarouselService){}

    @Post()
    async create(@Body() createdto){
        await this.carouselService.create(createdto)
        return {message:'작성에 성공했습니다.'}
    }

    @Get()
    async findAll(){
        await this.carouselService.findAll()
        return {message:'carousel을 불러왔습니다.'}
    }

    @Patch()
    async update(){
        return {message:'수정에 성공했습니다.'}
    }

    @Delete()
    async delete(){
        return {message:'삭제에 성공했습니다.'}
    }

}