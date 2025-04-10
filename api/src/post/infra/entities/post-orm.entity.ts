import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  title: string;
  @Column()
  author: string;
}
