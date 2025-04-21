import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostOrmEntity } from "./post-orm.entity";

@Entity()
export class PostImageOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  postId: number;
  @Column({ length: 100 })
  filename: string;
  @Column()
  fileSize: number;
  @ManyToOne(() => PostOrmEntity, (post) => post.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: PostOrmEntity;
}
