import { DataSource } from "typeorm"
import { TypeormCarouselRepository } from "./typeorm-carousel.repository"
import { CarouselOrmEntity } from "../entites/carousel.entity"
import { Carousel } from "src/carousel/domain/entities/carousel.entity"

describe("TypeormCarouselRepository (Integration)",()=>{
    let dataSource:DataSource
    let repository:TypeormCarouselRepository
    const expectValue={
        image:'/203846-92082392.jpg',
        postId:1,
        KoreanTitle:'한글',
        KoreanDescription:'한글설명',
        EnglishTitle:'영어',
        EnglishDescription:'영어설명',
        JapaneseTitle:'일본어',
        JapaneseDescription:'일본어설명',
    }

    beforeAll(async ()=>{
        dataSource=new DataSource({
            type:"sqlite",
            database:":memory:",
            synchronize:true,
            entities:[CarouselOrmEntity]
        })
        await dataSource.initialize()
        repository= new TypeormCarouselRepository(dataSource)
    })
    afterAll(async ()=>{
        await dataSource.destroy()
    })

    it("should create and return a carousel",async ()=>{
        const input =new Carousel(
            expectValue.image,
            expectValue.postId,
            expectValue.KoreanTitle,
            expectValue.KoreanDescription,
            expectValue.EnglishTitle,
            expectValue.EnglishDescription,
            expectValue.JapaneseTitle,
            expectValue.JapaneseDescription,
        )
        const created = await repository.create(input)

        expect(created.id).toBeDefined()
        expect(created.image).toBe("/203846-92082392.jpg")
    })
    it("should get all carousel",async ()=>{
        
    })
})