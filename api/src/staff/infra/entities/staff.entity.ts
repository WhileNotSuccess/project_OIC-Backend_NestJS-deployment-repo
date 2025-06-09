import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StaffOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  position: string;
  @Column()
  phone: string;
  @Column()
  email: string;
  @Column()
  team: string;
  @Column()
  position_jp: string;
  @Column()
  team_jp: string;
  @Column()
  position_en: string;
  @Column()
  team_en: string;
  @Column({ nullable: true })
  role: string;
  @Column({ nullable: true })
  role_en: string;
  @Column({ nullable: true })
  role_jp: string;
  @Column({ default: 100 })
  order: number;
}
