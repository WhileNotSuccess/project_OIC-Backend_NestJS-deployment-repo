import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  password: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  googleId: string;
}
