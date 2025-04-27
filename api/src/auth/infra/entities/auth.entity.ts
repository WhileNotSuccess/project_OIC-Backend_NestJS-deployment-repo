import { UserOrmEntity } from "../../../users/infra/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: "auth" })
export class AuthOrmEntity {
  @PrimaryColumn()
  userId: number;
  @Column({ nullable: true })
  hashedPassword: string;
  @Column({ nullable: true })
  googleId: string;
  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user: UserOrmEntity;
}
