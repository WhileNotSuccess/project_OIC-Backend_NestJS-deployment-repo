import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CarouselOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image: string;
  @Column()
  koreanPostId: number;
  @Column()
  englishPostId: number;
  @Column()
  japanesePostId: number;
  @Column()
  koreanTitle: string;
  @Column()
  koreanDescription: string;
  @Column()
  englishTitle: string;
  @Column()
  englishDescription: string;
  @Column()
  japaneseTitle: string;
  @Column()
  japaneseDescription: string;
}
