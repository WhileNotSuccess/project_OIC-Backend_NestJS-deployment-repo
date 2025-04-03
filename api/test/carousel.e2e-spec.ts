import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CarouselModule } from "src/carousel/carousel.model"
import * as request from "supertest"
import { CarouselResponse } from "./types/carousel-response"

describe("CarouselController (e2e)",()=>{
    let app:INestApplication
    const expectValue:Partial<CarouselResponse>={
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
        const moduleFixture:TestingModule=await Test.createTestingModule({
            imports:[
                TypeOrmModule.forRoot({
                    type:'sqlite',
                    database:':memory:',
                    entities:[],
                    synchronize:true,
                }),
                CarouselModule,
            ],
        }).compile()
        app=moduleFixture.createNestApplication()
        await app.init();
    })
    afterAll(async ()=>{
        await app.close()
    })
    let createdId:number;

    it("/carousel (POST) should create a carousel",async ()=>{
        const server=app.getHttpServer() as unknown as Parameters<typeof request>[0]
        const res =await request(server)
            .post("/carousel")
            .send(expectValue)
            .expect(201)

        const body:CarouselResponse=res.body as CarouselResponse
        createdId=body.id

        expect(res.body).toMatchObject(expectValue)
    })

    it("/carousel (GET) should return three carousel",async ()=>{
        const server=app.getHttpServer() as unknown as Parameters<typeof request>[0]
        const res=await request(server).get("/carousel").expect(200)
        const body:CarouselResponse[]=res.body as CarouselResponse[]

        expect(Array.isArray(body)).toBe(true)

        expect(body.length).toBeGreaterThan(0)
    })

    it("/carousel/:id (GET) should return one carousel",async ()=>{
        const server=app.getHttpServer() as unknown as Parameters<typeof request>[0]
        const res=await request(server).get(`/carousel/${createdId}`).expect(200)
        const body:CarouselResponse=res.body as CarouselResponse

        expect(body.id).toBe(createdId)
        expect(body.image).toBe(expectValue.image)
    })
    
    it("/carousel/:id (PATCH) should update carousel info",async ()=>{
        const server=app.getHttpServer() as unknown as Parameters<typeof request>[0]
        const res=await request(server).patch(`/carousel/${createdId}`).send({
            KoreanTitle:'수정된 한글'
        }).expect(200)
        const body:CarouselResponse=res.body as CarouselResponse

        expect(body.KoreanTitle).toBe("수정된 한글")
    })

    it("/carousel/:id (DELETE) should delete the carousel",async ()=>{
        const server=app.getHttpServer() as unknown as Parameters<typeof request>[0]
        await request(server).delete(`/carousel/${createdId}`).expect(200)
        await request(server).get(`/carousel/${createdId}`).expect(404)

    })
})