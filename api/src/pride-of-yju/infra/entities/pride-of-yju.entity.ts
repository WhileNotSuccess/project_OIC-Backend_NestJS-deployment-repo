import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrideOfYjuOrmEntity{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    image:string
    @Column()
    Korean:string
    @Column()
    English:string
    @Column()
    Japanese:string
}