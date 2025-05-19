import { PostOrmEntity } from "src/post/infra/entities/post-orm.entity";
import { AuthOrmEntity } from "../../../auth/infra/entities/auth.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "user" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  name: string;
  @CreateDateColumn()
  createDate: Date;
  @OneToOne(() => AuthOrmEntity, (auth) => auth.user)
  auth: AuthOrmEntity;
  @OneToMany(() => PostOrmEntity, (post) => post.userId, {
    onDelete: "CASCADE",
  })
  posts: PostOrmEntity[];
}
