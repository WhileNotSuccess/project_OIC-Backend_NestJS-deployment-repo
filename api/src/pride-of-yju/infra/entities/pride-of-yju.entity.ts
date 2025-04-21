import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PrideOfYjuOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image: string;
  @Column()
  korean: string;
  @Column()
  english: string;
  @Column()
  japanese: string;
}
