import { Language } from "src/post/domain/types/language";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AttachmentOrmEntity } from "./attachment-orm.entity";
import { PostImageOrmEntity } from "./post-image-orm-entity";

@Entity()
export class PostOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: "longtext" })
  content: string;
  @Column()
  userId: number;
  @Column()
  category: string;
  @Column({ type: "enum", enum: Language, default: "korean" })
  language: Language;
  @CreateDateColumn()
  createdDate: Date;
  @UpdateDateColumn()
  updatedDate: Date;
  @OneToMany(() => AttachmentOrmEntity, (attach) => attach.postId, {
    onDelete: "CASCADE",
  })
  attaches: AttachmentOrmEntity[];
  @OneToMany(() => PostImageOrmEntity, (postImage) => postImage.postId, {
    onDelete: "CASCADE",
  })
  images: PostImageOrmEntity[];
}
