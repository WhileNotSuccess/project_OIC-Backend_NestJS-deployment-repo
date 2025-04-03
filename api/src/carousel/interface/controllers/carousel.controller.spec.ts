import { CarouselController } from "./carousel.controller";
import { CarouselService } from "../../application/services/carousel.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CarouselResponse } from "test/types/carousel-response";
import { Carousel } from "src/carousel/domain/entities/carousel.entity";

describe("CarouselController",()=>{
    let controller:CarouselController;
    let service: jest.Mocked<CarouselService>
    const dto:Partial<CarouselResponse>={
            image:'/203846-92082392.jpg',
            postId:1,
            KoreanTitle:'한글',
            KoreanDescription:'한글설명',
            EnglishTitle:'영어',
            EnglishDescription:'영어설명',
            JapaneseTitle:'일본어',
            JapaneseDescription:'일본어설명',
        }

     beforeEach(async ()=>{
        const module:TestingModule= await Test.createTestingModule({
            controllers:[CarouselController],
            providers:[{
                provide:CarouselService,
                useValue:{
                    create:jest.fn()
                }
            }]
        }).compile()

        controller=module.get<CarouselController>(CarouselController)
        service= module.get(CarouselService)
     })

    it("should be defined",()=>{ // 단일 동작, 이 경우에는 각 describe가 실행 되기 전 beforeEach가 실행되어 controller가 정의되었는지 확인
        expect(controller).toBeDefined();
    })

    describe("create",()=>{ // describe는 it(단일 동작)을 그룹화
        it("should create a carousel",async ()=>{
            const created= new Carousel( // mock 설정 해둘 값 생성
                dto.image!,
                dto.postId!,
                dto.KoreanTitle!,
                dto.KoreanDescription!,
                dto.EnglishTitle!,
                dto.EnglishDescription!,
                dto.JapaneseTitle!,
                dto.JapaneseDescription!,
                1,
            )
            service.create.mockResolvedValue(created) //mock 설정 

            const result=await controller.create(dto)

            expect(result).toEqual(created)
            expect(service.create).toHaveBeenCalledWith(dto)
        })
    })
    describe("findAll",()=>{
        it("should return all carousel",async ()=>{
            const carouselList=[
                new Carousel(
                    "/123456-image.jpg"!,
                    1,
                    (dto.KoreanTitle+'1')!,
                    (dto.KoreanDescription+'1')!,
                    (dto.EnglishTitle+'1')!,
                    (dto.EnglishDescription+'1')!,
                    (dto.JapaneseTitle+'1')!,
                    (dto.JapaneseDescription+'1')!,
                    1
                ),
                new Carousel(
                    "/098765-image.jpg",
                    2,
                    (dto.KoreanTitle+'2')!,
                    (dto.KoreanDescription+'2')!,
                    (dto.EnglishTitle+'2')!,
                    (dto.EnglishDescription+'2')!,
                    (dto.JapaneseTitle+'2')!,
                    (dto.JapaneseDescription+'2')!,
                    2
                ),
            ]
            service.findAll.mockResolvedValue(carouselList)
        })
    })
    
})