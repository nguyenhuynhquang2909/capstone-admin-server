import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  url: string;

  @Column({ nullable: false })
  post_id: string;

  @ManyToOne(() => Post, (post) => post.images)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
