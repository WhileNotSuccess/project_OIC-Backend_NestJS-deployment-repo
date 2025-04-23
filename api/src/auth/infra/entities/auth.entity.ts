import { Column, Entity } from "typeorm";

@Entity({ name: "auth" })
export class AuthOrmEntity {
  @Column()
  userId: string;
  @Column()
  hashedPassword: string;
  @Column()
  googleId: string;
}
