import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CorporationOrmEntity } from "./corporation.entity";

@Entity()
export class CountryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  englishName: string;
  @Column()
  japaneseName: string;
  @Column()
  x: number;
  @Column()
  y: number;
  @OneToMany(() => CorporationOrmEntity, (corporation) => corporation.countryId)
  corporation: CorporationOrmEntity[];
}
