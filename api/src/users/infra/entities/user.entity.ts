import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "user" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  email: string;
  @Column()
  name: string;
  @CreateDateColumn()
  createDate: Date;
}
