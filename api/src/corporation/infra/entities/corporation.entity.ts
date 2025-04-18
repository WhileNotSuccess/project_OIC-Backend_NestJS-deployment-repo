import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryOrmEntity } from "./country.entity";

@Entity()
export class CorporationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  countryId: number;
  @Column()
  koreanName: string;
  @Column()
  englishName: string;
  @Column()
  corporationType: string;
  @ManyToOne(() => CountryOrmEntity, (country) => country.id)
  @JoinColumn({ name: "countryId" })
  country: CountryOrmEntity;
}
