import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostOrmEntity } from "./post-orm.entity";

@Entity()
export class AttachmentOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  postId: number;
  @Column()
  url: string;
  @Column()
  originalName: string;
  @ManyToOne(() => PostOrmEntity, (post) => post.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: PostOrmEntity;
}
