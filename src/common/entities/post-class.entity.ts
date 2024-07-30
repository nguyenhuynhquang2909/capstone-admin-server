import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Class } from './class.entity';
import { Post } from './post.entity';

@Entity({ name: 'post_classes' })
export class PostClass {
  @PrimaryColumn()
  class_id: number;

  @PrimaryColumn()
  post_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.post_classes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Post, (post) => post.post_classes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
