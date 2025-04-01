import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StaffOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  phoneNumber: string;
  @Column()
  role: string;
}
