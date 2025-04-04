import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CarouselOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image: string;
  @Column()
  postId: number;
  @Column()
  KoreanTitle: string;
  @Column()
  KoreanDescription: string;
  @Column()
  EnglishTitle: string;
  @Column()
  EnglishDescription: string;
  @Column()
  JapaneseTitle: string;
  @Column()
  JapaneseDescription: string;
}
